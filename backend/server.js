const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const tenantRoutes = require('./src/routes/tenants');
const paymentRoutes = require('./src/routes/payments');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

//health check endpoint

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date()});
});
//routes - all under /api/v1 prefix
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/tenants', tenantRoutes);
apiRouter.use('/payments', paymentRoutes);

app.use('/api/v1', apiRouter);

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'internal server error',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('auth endpoints: https://localhost:' + PORT + '/api/auth');
});
module.exports = app; // for testing
// // import config and middleware
// const { PORT, NODE_ENV, CORS_ORIGIN, API_VERSION } = require('./src/config/constants');
// const errorHandler = require('./src/middleware/errorHandler');

// // import routes
// const authRoutes = require('./src/routes/auth');
// const tenantRoutes = require('./src/routes/tenants');
// const paymentRoutes = require('./src/routes/payments');

// // initialize express app
// const app = express();

// // middleware 
// app.use(helmet()); // security headers
// app.use(cors({ origin: CORS_ORIGIN })); // enable CORS
// app.use(express.json()); // parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// //request logging middleware
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//     next();
// });

// // health check endpoint
// app.get('/health', (req, res) => {
//     res.json({
//         success: true,
//         message: 'API is healthy',
//         timestamp: new Date().toISOString(),
//         environment: NODE_ENV,
//     });
// });

// // API routes
// const apiPrefix = `/api/${API_VERSION}`;

// app.use(`${apiPrefix}/auth`, authRoutes);
// app.use(`${apiPrefix}/tenants`, tenantRoutes);
// app.use(`${apiPrefix}/payments`, paymentRoutes);

// // home endpoint
// app.get('/', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Welcome to the Apartment Management System API',
//         version : API_VERSION,
//         endpoints: {
//             health: '/health',
//             auth: `${apiPrefix}/auth`,
//             tenants: `${apiPrefix}/tenants`,
//             payments: `${apiPrefix}/payments`,
//         },
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Endpoint not found',
//         path: req.path,
//     });
// });

// // error handling middleware
// app.use(errorHandler);

// // start server
// const server = app.listen(PORT, () => {
//     console.log(`
// ╔════════════════════════════════════════════════════╗
// ║   Apartment Management System - Backend Server   ║
// ╚════════════════════════════════════════════════════╝

// ✅ Server running on http://localhost:${PORT}
// 📝 Environment: ${NODE_ENV}
// 🔀 CORS Origin: ${CORS_ORIGIN}
// 📌 API Version: ${API_VERSION}

// Available Endpoints:
//   GET    /health                      - Server health check
//   GET    /api/${API_VERSION}/auth                 - Auth routes
//   GET    /api/${API_VERSION}/tenants              - Tenant routes
//   GET    /api/${API_VERSION}/payments             - Payment routes

// Press Ctrl+C to stop the server
// `);
// });

// // graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received, shutting down gracefully...');
//     server.close(() => {
//         console.log('Server closed. Exiting process.');
//         process.exit(0);
//     });
// });

// module.exports = app; // export app for testing