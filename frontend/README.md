# Apartment Management System - Frontend

React and Tailwind CSS-based user interface for the Apartment Management System.

## Prerequisites

- Node.js v14+
- npm v6+
- Backend API running on port 5000

## Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy `.env.example` to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Update environment variables if needed

## Running the App

### Development:
\`\`\`bash
npm start
\`\`\`

The app will open at `http://localhost:3000`

### Production Build:
\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build.

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── services/        # API service layer
│   ├── context/         # React Context for state
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main App component
│   └── index.js         # Entry point
├── public/              # Static assets
├── .env                 # Environment variables (local)
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
\`\`\`

## Technologies

- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## Features

- User authentication (Login/Register)
- Protected routes
- Tenant management
- Payment tracking
- Responsive design with Tailwind CSS
- API integration with backend

## Environment Variables

See `.env.example` for all available variables.

## API Integration

API calls are handled through the `services/` directory:
- \`authService.js\` - Authentication endpoints
- \`tenantService.js\` - Tenant management
- \`paymentService.js\` - Payment management

Token is automatically stored in localStorage and included in requests.

## Testing

\`\`\`bash
npm test
\`\`\`

## Build & Deploy

\`\`\`bash
npm run build
\`\`\`

The \`build/\` folder contains the production-ready files.

## License
