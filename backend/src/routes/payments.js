const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.use(authMiddleware);

// Stats endpoint (place before /:id to avoid conflicts)
router.get('/stats', requireAdmin, (req, res, next) => {
    paymentController.getPaymentStats(req, res, next);
});

// List all payments (admin only)
router.get('/', requireAdmin, (req, res, next) => {
    paymentController.getAllPayments(req, res, next);
});

// Create new payment (admin only)
router.post('/', requireAdmin, (req, res, next) => {
    paymentController.createPayment(req, res, next);
});

// Record a payment (admin only)
router.post('/record', requireAdmin, (req, res, next) => {
    paymentController.recordPayment(req, res, next);
});

// Get tenant payment history
router.get('/tenant/:tenant_id', (req, res, next) => {
    paymentController.getTenantPayments(req, res, next);
});

// Get single payment by ID
router.get('/:id', (req, res, next) => {
    paymentController.getPaymentById(req, res, next);
});

// Update payment (admin only)
router.put('/:id', requireAdmin, (req, res, next) => {
    paymentController.updatePayment(req, res, next);
});

// Delete payment (admin only)
router.delete('/:id', requireAdmin, (req, res, next) => {
    paymentController.deletePayment(req, res, next);
});

module.exports = router;