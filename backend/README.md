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