# Backend Setup Guide - Node.js & Express

This is a step-by-step guide to set up the backend infrastructure for the Apartment Management System using Node.js and Express.

## Prerequisites

Before starting, make sure you have:
- **Node.js** (v14 or higher) - Download from https://nodejs.org
- **npm** (comes with Node.js)
- **A code editor** (VS Code recommended)
- **Terminal/Command Prompt**

Verify installation:
```bash
node --version
npm --version
```

---

## Step 1: Create Project Directory

Create a new directory for your backend project:

```bash
# Navigate to your workspace
cd c:\Users\Admin\Downloads\Apartment-Management-System

# Create backend directory
mkdir backend
cd backend
```

---

## Step 2: Initialize Node.js Project

Initialize a new Node.js project with npm:

```bash
npm init
```

You'll be prompted with several questions. Here's what to enter:

```
package name: apartment-management-system-backend
version: (1.0.0) [Press Enter]
description: Backend API for Apartment Management System
entry point: (index.js) server.js
test command: jest [or leave blank]
git repository: [Press Enter]
keywords: [Press Enter]
author: [Your name]
license: ISC [or choose MIT]
```

Your `package.json` will look like:

```json
{
  "name": "apartment-management-system-backend",
  "version": "1.0.0",
  "description": "Backend API for Apartment Management System",
  "main": "server.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

## Step 3: Install Core Dependencies

Install all required packages:

```bash
npm install express pg dotenv bcrypt jsonwebtoken cors helmet
```

**What each package does:**
- **express** - Web framework for Node.js
- **pg** - PostgreSQL client for database connection
- **dotenv** - Load environment variables from .env file
- **bcrypt** - Password hashing library
- **jsonwebtoken** - JWT token creation and verification
- **cors** - Handle Cross-Origin Resource Sharing
- **helmet** - Secure HTTP headers

**Optional development dependencies:**

```bash
npm install --save-dev nodemon
```

- **nodemon** - Automatically restart server on file changes

Update `package.json` scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

---

## Step 4: Create Project Directory Structure

Create the following folder structure:

```bash
# Create directories
mkdir src
mkdir src/routes
mkdir src/controllers
mkdir src/models
mkdir src/middleware
mkdir src/config
mkdir src/utils
mkdir logs
```

Final directory structure:
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tenants.js
│   │   └── payments.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tenantController.js
│   │   └── paymentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Tenant.js
│   │   └── Payment.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   └── utils/
│       ├── validators.js
│       └── helpers.js
├── logs/
├── .env.template
├── .env (local - don't commit)
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## Step 5: Create Environment Variables Template

Create `.env.template` file (this shows what variables are needed):

```bash
# Create the template file
echo "# Environment Variables Template" > .env.template
```

Add this content to `.env.template`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=apartment_management_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug

# API Configuration
API_VERSION=v1
```

Now create the actual `.env` file for local development:

```bash
# Create .env file (this is local and should NOT be committed)
cat > .env << EOF
NODE_ENV=development
PORT=5000
HOST=localhost

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=apartment_management_db

JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000

LOG_LEVEL=debug

API_VERSION=v1
EOF
```

Create `.gitignore`:

```bash
cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json
npm-debug.log*

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# Database
*.sqlite
*.db
EOF
```

---

## Step 6: Configure Database Connection

Create `src/config/database.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

Create `src/config/constants.js`:

```javascript
module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  API_VERSION: process.env.API_VERSION || 'v1',
};
```

---

## Step 7: Create Middleware

Create `src/middleware/errorHandler.js`:

```javascript
// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

Create `src/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
```

---

## Step 8: Create Basic Routes

Create `src/routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented later
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint - to be implemented',
  });
});

router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint - to be implemented',
  });
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout endpoint - to be implemented',
  });
});

module.exports = router;
```

Create `src/routes/tenants.js`:

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder routes - will be implemented later
router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Get all tenants - to be implemented',
  });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Create tenant - to be implemented',
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Get tenant ${req.params.id} - to be implemented`,
  });
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Update tenant ${req.params.id} - to be implemented`,
  });
});

router.delete('/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Delete tenant ${req.params.id} - to be implemented`,
  });
});

module.exports = router;
```

Create `src/routes/payments.js`:

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder routes - will be implemented later
router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Get all payments - to be implemented',
  });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Record payment - to be implemented',
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Get payment ${req.params.id} - to be implemented`,
  });
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Update payment ${req.params.id} - to be implemented`,
  });
});

module.exports = router;
```

---

## Step 9: Create Main Server File

Create `server.js` in the root of your backend directory:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import configuration and middleware
const { PORT, NODE_ENV, CORS_ORIGIN, API_VERSION } = require('./src/config/constants');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const tenantRoutes = require('./src/routes/tenants');
const paymentRoutes = require('./src/routes/payments');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: CORS_ORIGIN })); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes
const apiPrefix = `/api/${API_VERSION}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/tenants`, tenantRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);

// Home endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Apartment Management System API',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      auth: `${apiPrefix}/auth`,
      tenants: `${apiPrefix}/tenants`,
      payments: `${apiPrefix}/payments`,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Apartment Management System - Backend Server   ║
╚════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
📝 Environment: ${NODE_ENV}
🔀 CORS Origin: ${CORS_ORIGIN}
📌 API Version: ${API_VERSION}

Available Endpoints:
  GET    /health                      - Server health check
  GET    /api/${API_VERSION}/auth                 - Auth routes
  GET    /api/${API_VERSION}/tenants              - Tenant routes
  GET    /api/${API_VERSION}/payments             - Payment routes

Press Ctrl+C to stop the server
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
```

---

## Step 10: Create README.md for Backend

Create `README.md` in the backend directory:

```markdown
# Apartment Management System - Backend

Node.js and Express-based REST API for the Apartment Management System.

## Prerequisites

- Node.js v14+
- npm v6+
- PostgreSQL v12+

## Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy `.env.template` to `.env` and update values:
   \`\`\`bash
   cp .env.template .env
   \`\`\`

3. Set up the database (see Phase 1.3)

## Running the Server

### Development (with auto-restart):
\`\`\`bash
npm run dev
\`\`\`

### Production:
\`\`\`bash
npm start
\`\`\`

Server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Authentication
- **POST** `/api/v1/auth/login` - User login
- **POST** `/api/v1/auth/register` - User registration
- **POST** `/api/v1/auth/logout` - User logout

### Tenants
- **GET** `/api/v1/tenants` - Get all tenants
- **POST** `/api/v1/tenants` - Create tenant
- **GET** `/api/v1/tenants/:id` - Get tenant details
- **PUT** `/api/v1/tenants/:id` - Update tenant
- **DELETE** `/api/v1/tenants/:id` - Delete tenant

### Payments
- **GET** `/api/v1/payments` - Get all payments
- **POST** `/api/v1/payments` - Record payment
- **GET** `/api/v1/payments/:id` - Get payment details
- **PUT** `/api/v1/payments/:id` - Update payment

## Project Structure

\`\`\`
backend/
├── src/
│   ├── routes/           # API route definitions
│   ├── controllers/      # Business logic
│   ├── models/           # Data models
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── logs/                 # Log files
├── .env                  # Environment variables (local)
├── .env.template         # Environment variables template
├── server.js             # Entry point
└── package.json          # Project dependencies
\`\`\`

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **dotenv** - Environment variable management
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **helmet** - Security headers

## Dev Dependencies

- **nodemon** - Auto-restart on file changes

## Environment Variables

See `.env.template` for all available environment variables.

## Testing

\`\`\`bash
npm test
\`\`\`

## Database

Database setup is handled in Phase 1.3. Run migrations after setting up the database.

## License

ISC
```

---

## Step 11: Verify Installation

Test that everything is working:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **In another terminal, test the health endpoint:**
   ```bash
   curl http://localhost:5000/health
   ```

   Or use PowerShell:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5000/health" | ConvertFrom-Json
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2026-03-19T00:00:00.000Z",
     "environment": "development"
   }
   ```

---

## Step 12: Test API Endpoints

You can test the placeholder endpoints:

```bash
# Test home endpoint
curl http://localhost:5000

# Test auth routes
curl -X POST http://localhost:5000/api/v1/auth/login

# Test tenant routes (will fail without token, but shows structure)
curl http://localhost:5000/api/v1/tenants
```

---

## Acceptance Criteria Checklist

- ✅ Express server runs on port 5000
- ✅ Project structure is organized (routes, controllers, models, middleware, config)
- ✅ All dependencies are listed in package.json
- ✅ .env.template file created with required variables
- ✅ .env file created for local development
- ✅ Database configuration file created
- ✅ Middleware set up (auth, error handling)
- ✅ Routes created (placeholder routes ready for implementation)
- ✅ Server.js entry point configured
- ✅ README documentation created
- ✅ .gitignore configured
- ✅ Health check endpoint working

---

## Next Steps

After completing this setup:

1. **Phase 1.2** - Set up frontend with React
2. **Phase 1.3** - Create PostgreSQL database schema
3. **Phase 2.1** - Implement JWT authentication endpoints
4. **Phase 2.2** - Create login UI in frontend

---

## Troubleshooting

### Port 5000 already in use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Module not found errors

```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Database connection errors

Check that PostgreSQL is running and `.env` variables are correct:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
```

### npm command not working

Ensure Node.js is properly installed:
```bash
node --version
npm --version
```

---

**Status**: ✅ Backend infrastructure setup complete!

You're now ready to proceed with Phase 1.2 (Frontend Setup) or Phase 1.3 (Database Setup).
