# Apartment Management System - Project Roadmap

## 1. System Overview

The Apartment Management System is a web-based application designed to streamline the management of apartment complexes, focusing on tenant management, rent payment tracking, and access control. The system provides separate interfaces for administrators and tenants, with role-based access control ensuring data security and appropriate functionality availability.

### Key Goals:
- **Efficient Tenant Management**: Centralized tenant information storage and management
- **Transparent Payment Tracking**: Real-time rent payment status and history
- **Role-Based Access**: Separate functionality for admins and tenants
- **User-Friendly Interface**: Clean, intuitive UI for both user types
- **Data Integrity**: Comprehensive audit trails and payment records

### User Roles:
1. **Admin**: Full system control, tenant management, payment tracking, reporting
2. **Tenant**: View personal information, check payment status, view payment history

---

## 2. Database Schema

### 2.1 Core Tables

#### **Users Table**
```
users
├── user_id (PK, UUID/INT)
├── email (UNIQUE, VARCHAR)
├── password_hash (VARCHAR)
├── role (ENUM: 'admin', 'tenant')
├── full_name (VARCHAR)
├── phone_number (VARCHAR)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── is_active (BOOLEAN)
└── last_login (TIMESTAMP)
```

#### **Tenants Table**
```
tenants
├── tenant_id (PK, UUID/INT)
├── user_id (FK → users.user_id)
├── apartment_number (VARCHAR, UNIQUE)
├── move_in_date (DATE)
├── move_out_date (DATE, NULLABLE)
├── monthly_rent_amount (DECIMAL)
├── contact_email (VARCHAR)
├── contact_phone (VARCHAR)
├── emergency_contact_name (VARCHAR)
├── emergency_contact_phone (VARCHAR)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── is_current (BOOLEAN)
```

#### **Payments Table**
```
payments
├── payment_id (PK, UUID/INT)
├── tenant_id (FK → tenants.tenant_id)
├── payment_month (DATE, format: YYYY-MM-01)
├── amount_due (DECIMAL)
├── amount_paid (DECIMAL, default: 0)
├── payment_status (ENUM: 'unpaid', 'partially_paid', 'paid')
├── payment_date (DATE, NULLABLE)
├── payment_method (VARCHAR: 'cash', 'check', 'transfer', 'card')
├── notes (TEXT)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── due_date (DATE)
```

#### **Payment History Table** (Audit Log)
```
payment_history
├── history_id (PK, UUID/INT)
├── payment_id (FK → payments.payment_id)
├── tenant_id (FK → tenants.tenant_id)
├── amount_paid (DECIMAL)
├── previous_status (VARCHAR)
├── new_status (VARCHAR)
├── payment_method (VARCHAR)
├── transaction_date (TIMESTAMP)
├── recorded_by (FK → users.user_id)
├── notes (TEXT)
└── created_at (TIMESTAMP)
```

#### **Admin Logs Table** (Audit Trail)
```
admin_logs
├── log_id (PK, UUID/INT)
├── admin_id (FK → users.user_id)
├── action (VARCHAR: 'tenant_added', 'tenant_deleted', 'tenant_edited', 'payment_recorded', 'payment_modified')
├── entity_type (VARCHAR: 'tenant', 'payment', 'user')
├── entity_id (VARCHAR)
├── changes_details (JSON)
├── timestamp (TIMESTAMP)
└── ip_address (VARCHAR)
```

### 2.2 Database Relationships Diagram
```
users (1) ──→ (many) tenants
users (1) ──→ (many) admin_logs
tenants (1) ──→ (many) payments
payments (1) ──→ (many) payment_history
users (1) ──→ (many) payment_history (recorded_by)
```

---

## 3. Suggested Technologies

### Frontend
- **Framework**: React.js or Vue.js
  - React: Better ecosystem, component reusability, larger community
  - Vue: Easier learning curve, smaller bundle size
- **State Management**: Redux (React) or Vuex/Pinia (Vue)
- **UI Library**: Material-UI, Bootstrap, or Tailwind CSS
- **HTTP Client**: Axios or Fetch API
- **Charts/Analytics**: Chart.js, D3.js, or ECharts (for payment dashboards)

### Backend
- **Runtime**: Node.js with Express.js or Django/Flask (Python)
  - Node.js + Express: JavaScript full-stack, JSON-native
  - Python: Rapid development, strong libraries
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi, Yup, or Marshmallow
- **API Documentation**: Swagger/OpenAPI

### Database
- **Primary DB**: PostgreSQL or MySQL
  - PostgreSQL: Advanced features, JSON support, better for complex queries
  - MySQL: Simpler, widely hosted
- **Caching**: Redis (for session management)

### DevOps & Deployment
- **Containerization**: Docker
- **Deployment**: Heroku, AWS, Azure, or DigitalOcean
- **Version Control**: Git (GitHub/GitLab)
- **CI/CD**: GitHub Actions or GitLab CI

### Testing
- **Unit Tests**: Jest, Mocha, or Pytest
- **E2E Tests**: Cypress or Selenium
- **API Testing**: Postman

**Recommended Stack (for university project):**
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Heroku or Vercel

---

## 4. Step-by-Step Implementation Plan

### Phase 1: Project Setup & Infrastructure (Week 1)

#### 1.1 Backend Setup
- [ ] Initialize Node.js project with Express
- [ ] Set up project structure (routes, controllers, models, middleware)
- [ ] Configure environment variables (.env file)
- [ ] Set up PostgreSQL database connection
- [ ] Install dependencies (express, pg, dotenv, bcrypt, jsonwebtoken)

#### 1.2 Frontend Setup
- [ ] Create React app using Create React App or Vite
- [ ] Set up project structure (components, pages, context, utilities)
- [ ] Configure routing with React Router
- [ ] Set up Tailwind CSS or chosen UI framework
- [ ] Install dependencies (axios, react-router-dom)

#### 1.3 Database Setup
- [ ] Create PostgreSQL database
- [ ] Write and execute migration scripts (create all tables)
- [ ] Set up database backup strategy
- [ ] Create sample data for testing

---

### Phase 2: Authentication System (Week 1-2)

#### 2.1 Backend Authentication
- [ ] Create User model and database table
- [ ] Implement password hashing with bcrypt
- [ ] Create login endpoint (POST /api/auth/login)
- [ ] Create registration endpoint (POST /api/auth/register) - admin only
- [ ] Implement JWT token generation and verification
- [ ] Create authentication middleware for protected routes
- [ ] Create logout endpoint (POST /api/auth/logout)
- [ ] Implement password reset functionality (optional)

#### 2.2 Frontend Authentication
- [ ] Create Login page component
- [ ] Implement form validation
- [ ] Set up API service for authentication
- [ ] Store JWT tokens (localStorage or sessionStorage)
- [ ] Create auth context/state management
- [ ] Implement protected routes
- [ ] Create logout functionality
- [ ] Add redirect logic based on user role

#### 2.3 Testing
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test token expiration
- [ ] Test protected route access

---

### Phase 3: Admin Dashboard (Week 2-3)

#### 3.1 Tenant Management
- [ ] Create Tenants table schema (if not done in Phase 1)
- [ ] Build backend API endpoints:
  - [ ] GET /api/tenants - List all tenants
  - [ ] POST /api/tenants - Create new tenant
  - [ ] GET /api/tenants/:id - Get tenant details
  - [ ] PUT /api/tenants/:id - Update tenant
  - [ ] DELETE /api/tenants/:id - Delete tenant
- [ ] Add input validation for tenant data
- [ ] Implement authorization checks (admin only)

#### 3.2 Admin Dashboard UI
- [ ] Create Admin Dashboard main page layout
- [ ] Build Dashboard homepage with quick statistics:
  - [ ] Total tenants
  - [ ] Total rent collected (current month)
  - [ ] Outstanding balances
  - [ ] Payment status overview
- [ ] Create Tenant Management page:
  - [ ] Display tenant list in table format
  - [ ] Add "Add New Tenant" button and modal form
  - [ ] Add Edit functionality for each tenant
  - [ ] Add Delete functionality with confirmation
  - [ ] Add search/filter by tenant name or apartment number
- [ ] Create responsive sidebar navigation
- [ ] Implement error handling and loading states

#### 3.3 Testing
- [ ] Test tenant CRUD operations
- [ ] Test form validation
- [ ] Test authorization (non-admins cannot access)

---

### Phase 4: Payment Tracking System (Week 3-4)

#### 4.1 Payment Management Backend
- [ ] Create Payments table schema
- [ ] Create Payment History table schema
- [ ] Build backend API endpoints:
  - [ ] GET /api/payments - List all payments with filters
  - [ ] GET /api/payments/:id - Get payment details
  - [ ] POST /api/payments - Record new payment
  - [ ] PUT /api/payments/:id - Update payment
  - [ ] GET /api/tenants/:tenant_id/payments - Get tenant payment history
  - [ ] GET /api/payments/stats - Get payment statistics
- [ ] Implement automatic status assignment logic:
  - [ ] unpaid: amount_paid = 0
  - [ ] partially_paid: 0 < amount_paid < amount_due
  - [ ] paid: amount_paid >= amount_due
- [ ] Create payment history logging

#### 4.2 Payment Tracking UI
- [ ] Create Payment Management page:
  - [ ] Display monthly payments in table with columns:
    - [ ] Tenant name, Apartment #, Amount due, Amount paid, Balance, Status, Due date
  - [ ] Color-code payment status (red: unpaid, yellow: partial, green: paid)
  - [ ] Add "Record Payment" button and modal form
  - [ ] Add Edit payment functionality
  - [ ] Add filter by status, tenant, date range
  - [ ] Add search functionality
- [ ] Create Payment History view for individual tenants
- [ ] Implement payment statistics dashboard:
  - [ ] Total collected
  - [ ] Total outstanding
  - [ ] Payment breakdown by status
  - [ ] Charts showing collection trends

#### 4.3 Testing
- [ ] Test payment recording
- [ ] Test status calculation
- [ ] Test payment history logging
- [ ] Test filtering and search

---

### Phase 5: Tenant Portal (Week 4)

#### 5.1 Tenant Portal Pages
- [ ] Create Tenant Dashboard:
  - [ ] Display personal information
  - [ ] Show current apartment assignment
- [ ] Create Payment Status page:
  - [ ] Display current rent amount due
  - [ ] Show amount already paid
  - [ ] Display remaining balance
  - [ ] Show payment status with visual indicator
  - [ ] Display due date
- [ ] Create Payment History page:
  - [ ] Show all historical payments
  - [ ] Display payment date, amount, method, status
  - [ ] Allow filtering by date range
- [ ] Implement read-only access restrictions
- [ ] Add breadcrumb navigation

#### 5.2 Styling & Navigation
- [ ] Create consistent UI color scheme
- [ ] Implement responsive design for mobile
- [ ] Test on different screen sizes

---

### Phase 6: Admin Reports & Analytics (Week 5)

#### 6.1 Reports Backend
- [ ] Create report generation endpoints:
  - [ ] GET /api/reports/payment-summary - Monthly/yearly payment overview
  - [ ] GET /api/reports/outstanding-balance - Tenants with outstanding balances
  - [ ] GET /api/reports/tenant-history - Detailed history per tenant
  - [ ] GET /api/reports/collection-trends - Payment collection trends

#### 6.2 Reports UI
- [ ] Create Reports dashboard page
- [ ] Build visual reports:
  - [ ] Payment collection chart (line graph)
  - [ ] Outstanding balance by tenant (bar chart)
  - [ ] Payment status pie chart
- [ ] Implement export to PDF functionality
- [ ] Add date range filtering

---

### Phase 7: Security & Optimization (Week 5-6)

#### 7.1 Security Measures
- [ ] Implement CORS (Cross-Origin Resource Sharing)
- [ ] Add rate limiting on login endpoint
- [ ] Implement request validation and sanitization
- [ ] Add SQL injection prevention (use parameterized queries)
- [ ] Implement XSS protection
- [ ] Set secure HTTP headers (Helmet.js for Node)
- [ ] Add HTTPS configuration

#### 7.2 Optimization
- [ ] Implement database indexing on frequently queried fields
- [ ] Add pagination to list endpoints
- [ ] Implement response caching where appropriate
- [ ] Optimize API response payload sizes
- [ ] Minify frontend assets
- [ ] Implement lazy loading for components

#### 7.3 Testing & Debugging
- [ ] Conduct security audit
- [ ] Performance testing
- [ ] Load testing
- [ ] Bug fixes and refinements

---

### Phase 8: Deployment & Documentation (Week 6)

#### 8.1 Deployment
- [ ] Set up Docker containers for backend and database
- [ ] Configure production environment variables
- [ ] Deploy backend to chosen platform (Heroku/AWS/Azure)
- [ ] Deploy frontend to chosen platform (Vercel/Netlify)
- [ ] Set up SSL certificates
- [ ] Configure database backups

#### 8.2 Documentation
- [ ] Write API documentation (Swagger/OpenAPI)
- [ ] Create user manual for admins
- [ ] Create user manual for tenants
- [ ] Document database schema
- [ ] Create development setup guide
- [ ] Document deployment process
- [ ] Create troubleshooting guide

#### 8.3 Final Testing
- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Performance testing in production
- [ ] Security testing

---

## 5. UI/UX Structure

### 5.1 Website Wireframe Overview

```
┌─────────────────────────────────────────────────────┐
│  Apartment Management System                         │
└─────────────────────────────────────────────────────┘

LOGIN PAGE
┌─────────────────────────┐
│   AMS Logo              │
│                         │
│  Email: ___________     │
│  Password: _______      │
│  [ Login ]              │
│  Forgot Password?       │
└─────────────────────────┘


ADMIN DASHBOARD
┌─────────────┬──────────────────────────────────────┐
│   Logo      │  Admin Dashboard                     │
│  ┌────────┐ ├──────────────────────────────────────┤
│  │TENANTS │ │  Welcome, [Admin Name]               │
│  ├────────┤ │                                      │
│  │PAYMENTS│ │  Quick Stats:                        │
│  ├────────┤ │  ┌─────────────┬──────────────────┐ │
│  │REPORTS │ │  │Total Tenants│  Total Collected │ │
│  ├────────┤ │  │     45      │    $18,500       │ │
│  │SETTINGS│ │  └─────────────┴──────────────────┘ │
│  └────────┘ │  ┌─────────────┬──────────────────┐ │
│             │  │Outstanding  │  Unpaid Rents    │ │
│  [Logout]   │  │   Balance   │      $2,300      │ │
└─────────────┴──────────────────────────────────────┘
```

### 5.2 Page Structure

#### **Admin Pages:**

1. **Login Page**
   - Email input
   - Password input
   - Login button
   - "Forgot Password" link
   - Company logo

2. **Admin Dashboard (Home)**
   - Header with user info & logout
   - Navigation sidebar
   - Quick statistics cards
   - Recent activity log
   - Quick action buttons

3. **Tenant Management Page**
   - List of all tenants (table view)
   - Columns: Name, Apartment #, Contact, Status, Move-in Date
   - Search/filter bar
   - Add New Tenant button
   - Edit button per tenant
   - Delete button per tenant
   - Pagination

4. **Tenant Detail Page**
   - Tenant personal information
   - Contact details
   - Current rent amount
   - Payment status
   - Payment history
   - Edit tenant button
   - Delete option

5. **Payment Management Page**
   - Monthly payments table view
   - Columns: Tenant, Apt #, Due, Paid, Balance, Status, Due Date
   - Status color coding
   - Record Payment button
   - Edit payment button
   - Filter by status/date
   - Search bar
   - Export to PDF

6. **Payment Recording Modal/Form**
   - Tenant selection (dropdown)
   - Month selection
   - Amount paid input
   - Payment method dropdown
   - Payment date picker
   - Notes field
   - Submit button

7. **Reports Page**
   - Collection summary chart
   - Outstanding balance chart
   - Payment status pie chart
   - Export button
   - Date range picker

#### **Tenant Pages:**

1. **Login Page** (same as admin)

2. **Tenant Dashboard (Home)**
   - Welcome message
   - Current apartment info
   - Quick payment status card
   - Recent payment

3. **Payment Status Page**
   - Current month rent amount
   - Amount paid
   - Outstanding balance
   - Payment status indicator
   - Due date
   - Payment method info

4. **Payment History Page**
   - All past payments in table
   - Columns: Month, Amount, Date Paid, Status, Method
   - Filter by date range
   - Print button

### 5.3 Color Scheme & Visual Indicators

**Status Colors:**
- 🟢 **Paid**: Green (#10B981)
- 🟡 **Partially Paid**: Yellow (#F59E0B)
- 🔴 **Unpaid**: Red (#EF4444)

**UI Color Palette:**
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### 5.4 Navigation Structure

```
Home Page
├── Admin Login
│   └── Admin Dashboard
│       ├── Tenant Management
│       │   ├── Add Tenant
│       │   ├── Edit Tenant
│       │   └── Delete Tenant
│       ├── Payment Management
│       │   ├── Record Payment
│       │   ├── Edit Payment
│       │   └── Payment History
│       ├── Reports
│       │   ├── Payment Summary
│       │   ├── Outstanding Balances
│       │   └── Trends
│       └── Settings
│           ├── Change Password
│           └── System Settings
└── Tenant Login
    └── Tenant Portal
        ├── Dashboard
        ├── Payment Status
        └── Payment History
```

---

## 6. Key Features Summary

### Admin Features:
✅ Add, edit, delete tenants  
✅ View all tenants with search/filter  
✅ Record rent payments  
✅ Track payment status (paid, partial, unpaid)  
✅ View payment history  
✅ Generate reports and analytics  
✅ View total collected and outstanding balances  
✅ Access admin logs and audit trail  

### Tenant Features:
✅ View personal information  
✅ Check current rent status  
✅ View payment history  
✅ See outstanding balance  

---

## 7. Testing Strategy

### Unit Tests
- Authentication logic
- Payment status calculation
- Input validation

### Integration Tests
- User login flow
- Payment recording workflow
- Tenant CRUD operations

### End-to-End Tests
- Complete admin workflow (login → add tenant → record payment)
- Complete tenant workflow (login → view status)
- Payment history tracking

### Security Tests
- SQL Injection prevention
- XSS protection
- Unauthorized access prevention
- Token expiration

---

## 8. Potential Enhancements (Future Versions)

- Email notifications for payment reminders
- SMS alerts
- Mobile app (React Native)
- Expense tracking for property maintenance
- Lease agreement management
- Maintenance request system
- Document storage for tenant files
- Multi-property support
- API integration with payment gateways
- Advanced analytics and forecasting
- Two-factor authentication
- Attendance/key tracking

---

## 9. Project Timeline & Milestones

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| Phase 1: Setup | Week 1 | Backend, Frontend, Database infrastructure |
| Phase 2: Auth | Week 1-2 | Login system, JWT tokens |
| Phase 3: Admin Dashboard | Week 2-3 | Tenant management, dashboard UI |
| Phase 4: Payments | Week 3-4 | Payment tracking, history |
| Phase 5: Tenant Portal | Week 4 | Tenant views, payment status |
| Phase 6: Reports | Week 5 | Analytics, reports, charts |
| Phase 7: Security | Week 5-6 | Security hardening, optimization |
| Phase 8: Deployment | Week 6 | Production deployment, documentation |

**Total Duration**: 6 weeks

---

## 10. Getting Started Checklist

- [ ] Set up development environment
- [ ] Create Git repository
- [ ] Set up backend project
- [ ] Set up frontend project
- [ ] Create PostgreSQL database
- [ ] Write database migration scripts
- [ ] Create API documentation template
- [ ] Set up testing framework
- [ ] Configure CI/CD pipeline
- [ ] Document project standards and conventions

---

**Last Updated**: March 2026  
**Status**: Ready for Implementation  
**Target Users**: University-level project teams
