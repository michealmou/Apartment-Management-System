const Payment = require('../models/payment');
const PaymentHistory = require('../models/PaymentHistory');
const AuditLogger = require('../utils/auditLogger');

class PaymentController {
    // GET /api/v1/payments - List all payments with pagination and filters
    static async getAllPayments(req, res, next) {
        try {
            const { page = 1, limit = 10, status, tenantId, apartmentId, startDate, endDate } = req.query;

            const filters = {};
            if (status) filters.status = status;
            if (tenantId) filters.tenantId = tenantId;
            if (apartmentId) filters.apartmentId = apartmentId;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const payments = await Payment.getAll(filters, { page: parseInt(page), limit: parseInt(limit) });
            const total = await Payment.getCount(filters);

            // Log audit
            if (req.user && req.user.role === 'admin') {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'READ_LIST',
                    entity_type: 'payment',
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                    notes: `Filters: ${JSON.stringify(filters)}`,
                }).catch(err => console.error('Audit logging failed:', err));
            }

            res.json({
                success: true,
                data: payments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/v1/payments/:id - Get payment details
    static async getPaymentById(req, res, next) {
        try {
            const { id } = req.params;
            const payment = await Payment.getById(id);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            res.json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/v1/payments - Record new payment
    static async createPayment(req, res, next) {
        try {
            const { tenant_id, apartment_id, amount_due, amount_paid = 0, due_date, payment_method, reference_number, notes } = req.body;

            // Validate required fields
            if (!tenant_id || !amount_due || !due_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: tenant_id, amount_due, due_date',
                });
            }

            const paymentData = {
                tenant_id,
                apartment_id,
                amount_due,
                amount_paid,
                due_date,
                payment_method,
                reference_number,
                notes,
            };

            const payment = await Payment.create(paymentData);

            // Log audit
            if (req.user && req.user.role === 'admin') {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'CREATE',
                    entity_type: 'payment',
                    entity_id: payment.id,
                    new_values: payment,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                }).catch(err => console.error('Audit logging failed:', err));
            }

            res.status(201).json({
                success: true,
                message: 'Payment created successfully',
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/v1/payments/:id - Update payment
    static async updatePayment(req, res, next) {
        try {
            const { id } = req.params;

            // Get current payment
            const oldPayment = await Payment.getById(id);
            if (!oldPayment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            const updates = req.body;
            const updatedPayment = await Payment.update(id, updates);

            // Log changes
            const changes = {};
            for (const [key, value] of Object.entries(updates)) {
                if (oldPayment[key] !== value) {
                    changes[key] = value;
                }
            }

            // Log audit
            if (req.user && req.user.role === 'admin') {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'UPDATE',
                    entity_type: 'payment',
                    entity_id: parseInt(id),
                    old_values: oldPayment,
                    new_values: changes,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                }).catch(err => console.error('Audit logging failed:', err));
            }

            res.json({
                success: true,
                message: 'Payment updated successfully',
                data: updatedPayment,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/v1/payments/:id - Delete payment
    static async deletePayment(req, res, next) {
        try {
            const { id } = req.params;

            const payment = await Payment.getById(id);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            await Payment.delete(id);

            // Log audit
            if (req.user && req.user.role === 'admin') {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'DELETE',
                    entity_type: 'payment',
                    entity_id: parseInt(id),
                    old_values: payment,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                }).catch(err => console.error('Audit logging failed:', err));
            }

            res.json({
                success: true,
                message: 'Payment deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/v1/tenants/:tenant_id/payments - Get tenant payment history
    static async getTenantPayments(req, res, next) {
        try {
            const { tenant_id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const payments = await Payment.getAll(
                { tenantId: tenant_id },
                { page: parseInt(page), limit: parseInt(limit) }
            );
            const total = await Payment.getCount({ tenantId: tenant_id });

            res.json({
                success: true,
                data: payments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/v1/payments/stats - Payment statistics
    static async getPaymentStats(req, res, next) {
        try {
            const { tenantId, apartmentId, startDate, endDate } = req.query;

            const filters = {};
            if (tenantId) filters.tenantId = tenantId;
            if (apartmentId) filters.apartmentId = apartmentId;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const stats = await Payment.getStats(filters);

            res.json({
                success: true,
                data: {
                    total_payments: parseInt(stats.total_payments),
                    paid_count: parseInt(stats.paid_count || 0),
                    unpaid_count: parseInt(stats.unpaid_count || 0),
                    partially_paid_count: parseInt(stats.partially_paid_count || 0),
                    total_due: parseFloat(stats.total_due || 0),
                    total_collected: parseFloat(stats.total_collected || 0),
                    outstanding_balance: parseFloat(stats.outstanding_balance || 0),
                    collection_rate: stats.total_due > 0
                        ? ((parseFloat(stats.total_collected || 0) / parseFloat(stats.total_due)) * 100).toFixed(2) + '%'
                        : '0%',
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Record payment (creates payment history)
    static async recordPayment(req, res, next) {
        try {
            const { payment_id, tenant_id, amount_paid, payment_method, transaction_id, description } = req.body;

            if (!payment_id || !tenant_id || !amount_paid) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                });
            }

            // Get the payment
            const payment = await Payment.getById(payment_id);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found',
                });
            }

            // Create payment history entry
            const newAmountPaid = (payment.amount_paid || 0) + amount_paid;
            const historyEntry = await PaymentHistory.create({
                payment_id,
                tenant_id,
                amount_paid,
                payment_date: new Date(),
                payment_method,
                transaction_id,
                status: Payment.calculateStatus(newAmountPaid, payment.amount_due),
                description,
            });

            // Update payment with new amount_paid
            const updatedPayment = await Payment.update(payment_id, {
                amount_paid: newAmountPaid,
                payment_date: new Date().toISOString().split('T')[0],
            });

            res.status(201).json({
                success: true,
                message: 'Payment recorded successfully',
                data: {
                    payment: updatedPayment,
                    history: historyEntry,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PaymentController;