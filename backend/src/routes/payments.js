const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// All payment rots require authentication
router.use(authenticate);

// statistics endpoint (plce before /:id to avoid conflict)
router.get('/stats', paymentController.getPaymentStats);

// all payments - admin only
router.get('/', requireAdmin, paymentController.getAllPayments);

// create payment - admin only
router.post('/', requireAdmin, paymentController.createPayment);

// get single payment by id 
router.get('/:id', paymentController.getPaymentById);

// update payment - admin only
router.put('/:id', requireAdmin, paymentController.updatePayment);

// get tenant payment history - admin or self
router.get('/tenant/:tenant_id', paymentController.getTenantPayments);

module.exports = router;