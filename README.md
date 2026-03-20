# 🏢 Apartment Management System

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()

**A full-stack web application for managing apartment properties, tenants, and rental payments.**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation](#️-installation)
- [🛠️ Development](#️-development)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [💬 Support](#-support)

---

## ✨ Features

### 🎯 Core Functionality
- ✅ **User Authentication** - Secure login/registration with role-based access
- ✅ **Tenant Management** - Add, edit, and manage tenant profiles
- ✅ **Payment Tracking** - Track rent payments and payment history
- ✅ **Admin Dashboard** - Comprehensive admin controls and logging
- ✅ **Audit Logs** - Track all system actions for compliance

### 🔐 Security
- 🛡️ JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 🚫 Role-based access control (RBAC)
- 📋 Comprehensive audit logging

### 📊 Data Management
- 💾 PostgreSQL relational database
- 🏗️ Structured migrations for version control
- 📈 Optimized queries with indexes
- 🔄 Automatic timestamp management

### 🎨 User Experience
- 🌓 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- ⚡ Fast and smooth interactions
- 🎯 Intuitive navigation

---

## 🚀 Quick Start

### Prerequisites
```bash
# Required:
- Node.js v18+
- npm v9+
- PostgreSQL v12+
```

### Get Started in 5 Minutes
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/apartment-management-system.git
cd apartment-management-system

# 2. Install dependencies (both frontend and backend)
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Setup database
# Copy and update the .env file with your PostgreSQL credentials
# Then run migrations:
npm run db:migrate
npm run db:seed

# 4. Start development servers
npm run dev
```

**API** will be available at [`http://localhost:5000`](http://localhost:5000)  
**Frontend** will be available at [`http://localhost:3000`](http://localhost:3000)

---

## 📦 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment configuration |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router** | Client-side routing |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **Context API** | State management |

### DevOps & Tools
| Technology | Purpose |
|---|---|
| **npm** | Package management |
| **PostgreSQL** | Database |
| **Git** | Version control |

---

## 📁 Project Structure

```
apartment-management-system/
├── backend/                          # Express.js REST API
│   ├── src/
│   │   ├── config/                  # Database & app config
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Auth, error handling
│   │   ├── models/                  # Database models
│   │   ├── routes/                  # API routes
│   │   └── utils/                   # Helper functions
│   ├── migrations/                  # Database migrations
│   ├── scripts/                     # Utility scripts
│   ├── server.js                    # Entry point
│   └── package.json
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── layouts/                 # Layout wrappers
│   │   ├── services/                # API services
│   │   ├── context/                 # React Context
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Helper utilities
│   │   └── App.jsx                  # Root component
│   ├── public/                      # Static assets
│   └── package.json
│
├── DATABASE_SETUP_GUIDE.md          # Detailed DB setup
├── ROADMAP.md                       # Project roadmap
└── package.json                     # Root package config
```

---

## ⚙️ Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/apartment-management-system.git
cd apartment-management-system
```

### Step 2: Install Dependencies
```bash
# Install root dependencies (optional helpers)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Database Setup

#### Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
CREATE DATABASE apartment_management_system;
CREATE USER ams_user WITH PASSWORD 'secure_password_change_this';
GRANT ALL PRIVILEGES ON DATABASE apartment_management_system TO ams_user;
\q
```

#### Run Migrations
```bash
cd backend

# Option A: Using migration script
node scripts/run_migration.js

# Option B: Using psql directly
psql -U ams_user -d apartment_management_system -f ../migrations/001_create_users_table.sql
psql -U ams_user -d apartment_management_system -f ../migrations/002_create_tenants_table.sql
# ... run all 5 migration files
```

#### Seed Database (Optional - for testing)
```bash
cd backend
node scripts/seed_database.js
```

### Step 4: Environment Configuration

#### Backend (.env)
Create `backend/.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apartment_management_system
DB_USER=ams_user
DB_PASSWORD=secure_password_change_this
DB_POOL_SIZE=20

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_API_TIMEOUT=10000
```

---

## 🛠️ Development

### Available Scripts

#### Backend
```bash
cd backend

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run migrations
npm run migrate

# Seed database
npm run seed
```

#### Frontend
```bash
cd frontend

# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Eject configuration (⚠️ one-way operation)
npm run eject
```

#### Root Level (Concurrently)
```bash
# Start both backend and frontend
npm run dev
```

### Database Migrations

See [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md) for detailed migration instructions.

```bash
# Schema includes:
# - users (authentication & admin)
# - tenants (tenant information)
# - payments (rent payments)
# - payment_history (payment audit trail)
# - admin_logs (system activity logs)
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "securepassword123",
  "phone": "555-0000"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Tenant Endpoints

#### Get All Tenants
```http
GET /tenants
Authorization: Bearer <token>
```

#### Get Tenant by ID
```http
GET /tenants/:id
Authorization: Bearer <token>
```

#### Create Tenant
```http
POST /tenants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "unit_number": "101",
  "unit_type": "Apartment",
  "rent_amount": 1200.00,
  "deposit_amount": 2400.00
}
```

#### Update Tenant
```http
PUT /tenants/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Tenant
```http
DELETE /tenants/:id
Authorization: Bearer <token>
```

### Payment Endpoints

#### Get All Payments
```http
GET /payments
Authorization: Bearer <token>
```

#### Create Payment Record
```http
POST /payments
Authorization: Bearer <token>
```

For complete API documentation, see backend routes folder or generate OpenAPI docs.

---

## 🤝 Contributing

We love contributions! Here's how to get started:

### Fork & Clone
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/your-username/apartment-management-system.git
cd apartment-management-system
```

### Create Feature Branch
```bash
# Create a new branch for your feature
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add some amazing feature'

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request on GitHub
```

### Development Guidelines
- ✅ Write clean, readable code
- ✅ Follow existing code patterns
- ✅ Test your changes thoroughly
- ✅ Add meaningful commit messages
- ✅ Update documentation as needed

### Code Style
- **Backend**: Standard Node.js conventions
- **Frontend**: React hooks and functional components
- **Formatting**: 2-space indentation, semicolons required

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Getting Help
- 📖 Check the [DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md)
- 📋 Review the [ROADMAP.md](ROADMAP.md)
- 🐛 [Open an Issue](https://github.com/yourusername/apartment-management-system/issues)

### Ask Questions
- Use [GitHub Discussions](https://github.com/yourusername/apartment-management-system/discussions)
- Check existing issues first

---

## 🎯 Roadmap

Check out [ROADMAP.md](ROADMAP.md) to see planned features and improvements!

### Current Status
- ✅ Phase 1: Database setup and core backend
- 🔄 Phase 2: Frontend UI and integration
- ⏳ Phase 3: Advanced features and optimization
- ⏳ Phase 4: Deployment and production

---

## 📈 Project Stats

![GitHub Repo Size](https://img.shields.io/github/repo-size/yourusername/apartment-management-system)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/apartment-management-system)
![GitHub Pull Requests](https://img.shields.io/github/pulls/yourusername/apartment-management-system)

---

<div align="center">

### Made with ❤️ for property managers

[⬆ back to top](#-apartment-management-system)

</div>