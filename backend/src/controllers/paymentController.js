const Payment = require('../models/payment');

/**
 * GET /api/payments
 * list all payments with pagination and filters
 */

exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const tenantId = req.query.tenantId;
        const apartmentId = req.query.apartmentId;

        //validate pagination
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page and limit must be positive integers'
            });
        }

        const filters = {};
        if (status) filters.status = status;
        if (tenantId) filters.tenantId = tenantId;
        if (apartmentId) filters.apartmentId = apartmentId;

        const pagination = { page, limit };
        const payments = await Payment.getAll(filters, pagination);
        const total = await Payment.getCount(filters);

        res.json({
            success: true,
            data: payments,
            pagination: {
                page,   
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

/**
 * GET /api/payments/:id
 * get single payment with history
 */

exports.getPaymentById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required'
            });
        }
        const paymentRecord = await Payment.getById(id);
        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        //get payment history
        const history = await Payment.getHistory(id);
        res.json({
            success: true,
            data: {
                ...paymentRecord,
                history
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error fetching payment',
            error: error.message
        });
    }
};

/**
 * POST /api/payments
 * create new payment
 */
exports.createPayment = async (req, res) => {
    try {
        const {
            tenant_id,
            amount,
            due_date,
            payment_method,
            notes,
        } = req.body;

        //validation

        if (!tenant_id || !amount || !due_date){
            return res.status(400).json({
                success: false,
                message: 'tenant_id, amount and due_date are required'
            });
        }

        if ( isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'amount must be a positive number'
            });
        }

        const createdPayment = await Payment.create({
            tenant_id,
            amount,
            due_date,
            payment_method,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: createdPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

/**
 * PUT /api/payments/:id
 * update payment and log history if amount_paid is updated
 */

exports.updatePayment = async (req, res) => {
    try {
        const {id} = req.params;
        const {status, payment_method, notes} = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required'
            });
        }

        const existingPayment = await Payment.getById(id);
        if (!existingPayment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        const updatedPayment = await Payment.update(id, {
            status,
            payment_method,
            notes
        });

        res.json({
            success: true,
            message: 'Payment updated successfully',
            data: updatedPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};
/** 
 * GET /api/tenants/:tenantId/payments
 * get payment history for a specific tenant 
 */
exports.getTenantPayments = async (req, res) => {
    try {  
        const {tenant_id} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!tenant_id) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID is required'
            });
        }
        const payments = await Payment.getByTenantId(tenant_id, {page, limit});
        const total = await Payment.getCount({tenantId: tenant_id});

        //get stats for the tenant
        const stats = await Payment.getStats({tenantId: tenant_id});
        res.json({
            success: true,
            data: payments,
            stats: {
                total_due: stats.total_due || 0,
                paid_count: stats.paid_count || 0,
                unpaid_count: stats.unpaid_count || 0
            },
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tenant payments',
            error: error.message
        });
    }
};
/** * GET /api/payments/stats
 * get overall payment statistics
 */
exports.getPaymentStats = async (req, res) => {
    try {
        const {tenantId, apartmentId, startDate, endDate} = req.query;

        const stats = await Payment.getStats({
            tenantId,
            apartmentId,
            startDate,
            endDate
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment statistics',
            error: error.message
        });
    }
};
/**
 * Get statistics for dashboard
 */
exports.getPaymentStats = async (req, res) => {
    try {
        const db = require('../config/database');
        
        // Get status overview
        const statusQuery = `
            SELECT 
                status,
                COUNT(*) as count
            FROM payments
            GROUP BY status
        `;
        
        const result = await db.query(statusQuery);
        const statusOverview = {
            paid: 0,
            pending: 0,
            overdue: 0,
            partial: 0
        };

        result.rows.forEach(row => {
            statusOverview[row.status.toLowerCase()] = parseInt(row.count);
        });

        res.json(statusOverview);
    } catch (error) {
        console.error('Error fetching payment stats:', error);
        res.status(500).json({ error: 'Failed to fetch payment statistics' });
    }
};

/**
 * Get monthly rent collected
 */
exports.getMonthlyRentCollected = async (req, res) => {
    try {
        const db = require('../config/database');
        
        const query = `
            SELECT COALESCE(SUM(amount), 0) as totalCollected
            FROM payments
            WHERE status = 'paid'
            AND DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', NOW())
        `;
        
        const result = await db.query(query);
        res.json({ totalCollected: parseFloat(result.rows[0].totalcollected) });
    } catch (error) {
        console.error('Error fetching monthly rent:', error);
        res.status(500).json({ error: 'Failed to fetch monthly rent' });
    }
};

/**
 * Get outstanding balance
 */
exports.getOutstandingBalance = async (req, res) => {
    try {
        const db = require('../config/database');
        
        const query = `
            SELECT COALESCE(SUM(amount), 0) as totalOutstanding
            FROM payments
            WHERE status IN ('pending', 'overdue', 'partial')
        `;
        
        const result = await db.query(query);
        res.json({ totalOutstanding: parseFloat(result.rows[0].totaloutstanding) });
    } catch (error) {
        console.error('Error fetching outstanding balance:', error);
        res.status(500).json({ error: 'Failed to fetch outstanding balance' });
    }
};