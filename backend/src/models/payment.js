const db = require('../config/database');

class Payment {
    /**
     * get all payments with optional filters for apartment_id and tenant_id
     * filters: {status, tenant_id, apartment_id, start_date, end_date}
     */
    static async getAll(filters = {}, prgination = {}) {
        const {status, tenantId, apartmentId, dueDate} = filters;
        const { page = 1, limit = 10 } = prgination;
        const offset = (page - 1) * limit;

        let query = `Select * FROM payments WHERE 1=1`;
        const values = [];
        if (status) {
            query += ` AND status = $` + (values.length + 1);
            values.push(status);
        }
        if (tenantId) {
            query += ` AND tenant_id = $` + (values.length + 1);
            values.push(tenantId);
        }
        if (apartmentId) {
            query += ` AND apartment_id = $` + (values.length + 1);
            values.push(apartmentId);
        }
        if (dueDate) {
            query += ` AND due_date <= $` + (values.length + 1);
            values.push(dueDate);
        }

        query += ` ORDER BY due_date DESC LIMIT $` + (values.length + 1) + ` OFFSET $` + (values.length + 2);
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    //get total amount of payments matched by filters
    static async getCount(filters = {}) {
        const {status, tenantId, apartmentId, dueDate} = filters;

        let query = 'SELECT COUNT(*) as total FROM payments WHERE 1=1';
        const values = [];
        if (status) {
            query += ` AND status = $` + (values.length + 1);
            values.push(status);
        }
        if (tenantId) {
            query += ` AND tenant_id = $` + (values.length + 1);
            values.push(tenantId);
        }
        if (apartmentId) {
            query += ` AND apartment_id = $` + (values.length + 1);
            values.push(apartmentId);
        }
        if (dueDate) {
            query += ` AND due_date = $` + (values.length + 1);
            values.push(dueDate);
        }
        const result = await db.query(query, values);
        return parseInt(result.rows[0].total);
    }

    //get payment by id
    static async getById(id) {
        const query = 'SELECT * FROM payments WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    //create new payment
    static async create(paymentData) {
        const {
            tenant_id,
            amount,
            due_date,
            payment_method,
            notes
        } = paymentData;

        const query = `
            INSERT INTO payments 
            (tenant_id, amount, due_date, payment_method, notes, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`
        ;
        const values = [
            tenant_id,
            amount,
            due_date,
            payment_method,
            notes,
            'pending'
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    //update payment status and details
    static async update(id, updateData) {
        const payment = await this.getById(id);
        if (!payment) throw new Error('Payment not found');

        const { status, payment_method, notes } = updateData;

        const query = `
            UPDATE payments SET
            status = $1,
            payment_method = $2,
            notes = $3,
            payment_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;

        const values = [
            status || 'pending',
            payment_method,
            notes,
            id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // get pay,emts for a specific tenant
    static async getByTenantId(tenantId, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const query = `
            SELECT * FROM payments
            WHERE tenant_id = $1
            ORDER BY due_date DESC, created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await db.query(query, [tenantId, limit, offset]);
        return result.rows;
    }
    // get payment statisics for dashboard
    static async getStats(filters = {}) {
        const {
            tenantId,
            apartmentId,
            startDate,
            endDate
        }= filters;

        let whereClause = 'WHERE 1=1';
        const values = [];
        if (tenantId) {
            whereClause += ` AND tenant_id = $` + (values.length + 1);
            values.push(tenantId);
        }
        if (apartmentId) {
            whereClause += ` AND apartment_id = $` + (values.length + 1);
            values.push(apartmentId);
        }
        if (startDate) {
            whereClause += ` AND due_date >= $` + (values.length + 1);
            values.push(startDate);
        }
        if (endDate) {
            whereClause += ` AND due_date <= $` + (values.length + 1);
            values.push(endDate);
        }
        const query = `
            SELECT 
                COUNT(*) AS total_payments,
                SUM(amount) AS total_due,
                COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid_count,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) AS unpaid_count
            FROM payments
            ${whereClause}
        `;
        const result = await db.query(query, values);
        return result.rows[0] || {
            total_payments: 0,
            total_due: 0,
            paid_count: 0,
            unpaid_count: 0
        };
    }
    //get payment history for specific payment
    static async getHistory(paymentId) {
        const query = `
            SELECT *
            FROM payment_history
            WHERE payment_id = $1 
            ORDER BY created_at DESC
        `;
        const result = await db.query(query, [paymentId]);
        return result.rows;
    }

    //log payment history
    static async logHistory(paymentId, tenantId, amountPaid, paymentMethod, status, description) {
    const query = `
        INSERT INTO payment_history
        (payment_id, tenant_id, amount_paid, payment_date, payment_method, status, description)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)
        RETURNING *
    `;
    const values = [
        paymentId,
        tenantId,
        amountPaid,
        paymentMethod,
        status,
        description
    ];
    const result = await db.query(query, values);
    return result.rows[0];
}

    //calculate payment status based on status field
    static calculateStatus(status) {
        // Status is stored directly in database as 'pending' or 'paid'
        return status || 'pending';
    }
}

module.exports = Payment;