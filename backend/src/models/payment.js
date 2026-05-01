const db = require('../config/database');

class Payment {
    // Utility function to calculate payment status
    static calculateStatus(amountPaid, amountDue) {
        if (amountPaid === 0) return 'unpaid';
        if (amountPaid >= amountDue) return 'paid';
        return 'partially_paid';
    }

    // Get all payments with filters and pagination
    static async getAll(filters = {}, pagination = {}) {
        const { status, tenantId, apartmentId, startDate, endDate } = filters;
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM payments WHERE 1=1`;
        const values = [];

        if (status) {
            query += ` AND status = $${values.length + 1}`;
            values.push(status);
        }
        if (tenantId) {
            query += ` AND tenant_id = $${values.length + 1}`;
            values.push(tenantId);
        }
        if (apartmentId) {
            query += ` AND apartment_id = $${values.length + 1}`;
            values.push(apartmentId);
        }
        if (startDate) {
            query += ` AND due_date >= $${values.length + 1}`;
            values.push(startDate);
        }
        if (endDate) {
            query += ` AND due_date <= $${values.length + 1}`;
            values.push(endDate);
        }

        query += ` ORDER BY due_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    // Get count of payments matching filters
    static async getCount(filters = {}) {
        const { status, tenantId, apartmentId, startDate, endDate } = filters;
        let query = 'SELECT COUNT(*) as total FROM payments WHERE 1=1';
        const values = [];

        if (status) {
            query += ` AND status = $${values.length + 1}`;
            values.push(status);
        }
        if (tenantId) {
            query += ` AND tenant_id = $${values.length + 1}`;
            values.push(tenantId);
        }
        if (apartmentId) {
            query += ` AND apartment_id = $${values.length + 1}`;
            values.push(apartmentId);
        }
        if (startDate) {
            query += ` AND due_date >= $${values.length + 1}`;
            values.push(startDate);
        }
        if (endDate) {
            query += ` AND due_date <= $${values.length + 1}`;
            values.push(endDate);
        }

        const result = await db.query(query, values);
        return parseInt(result.rows[0].total);
    }

    // Get single payment by ID
    static async getById(id) {
        const query = `SELECT * FROM payments WHERE id = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Create new payment
    static async create(paymentData) {
        const {
            tenant_id,
            apartment_id = null,
            amount_due,
            amount_paid = 0,
            due_date,
            payment_date,
            payment_method,
            reference_number,
            notes,
        } = paymentData;

        const status = this.calculateStatus(amount_paid, amount_due);

        // Try with all fields first
        const query = `
            INSERT INTO payments (
                tenant_id,
                amount,
                amount_due,
                amount_paid,
                due_date,
                payment_date,
                payment_method,
                reference_number,
                status,
                notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        try {
            const result = await db.query(query, [
                tenant_id,
                amount_due,  // amount field (backward compatibility)
                amount_due,
                amount_paid,
                due_date,
                payment_date,
                payment_method,
                reference_number,
                status,
                notes,
            ]);
            return result.rows[0];
        } catch (err) {
            // If amount column doesn't exist, retry without it
            if (err.code === '42703' && err.message.includes('amount')) {
                const simplifiedQuery = `
                    INSERT INTO payments (
                        tenant_id,
                        amount_due,
                        amount_paid,
                        due_date,
                        payment_date,
                        payment_method,
                        reference_number,
                        status,
                        notes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING *
                `;
                const result = await db.query(simplifiedQuery, [
                    tenant_id,
                    amount_due,
                    amount_paid,
                    due_date,
                    payment_date,
                    payment_method,
                    reference_number,
                    status,
                    notes,
                ]);
                return result.rows[0];
            }
            throw err;
        }
    }

    // Update payment
    static async update(id, updates) {
        const allowedFields = [
            'amount_due',
            'amount_paid',
            'payment_date',
            'payment_method',
            'reference_number',
            'notes',
        ];

        const fields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (fields.length === 0) return null;

        // Get current payment to calculate status
        const currentPayment = await this.getById(id);
        if (!currentPayment) return null;

        const amountPaid = updates.amount_paid !== undefined ? updates.amount_paid : currentPayment.amount_paid;
        const amountDue = updates.amount_due !== undefined ? updates.amount_due : currentPayment.amount_due;
        const status = this.calculateStatus(amountPaid, amountDue);

        fields.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);

        values.push(id);
        const query = `
            UPDATE payments 
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Delete payment
    static async delete(id) {
        const query = 'DELETE FROM payments WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Get payment statistics
    static async getStats(filters = {}) {
        const { tenantId, apartmentId, startDate, endDate } = filters;
        let query = `
            SELECT 
                COUNT(*) as total_payments,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
                SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
                SUM(CASE WHEN status = 'partially_paid' THEN 1 ELSE 0 END) as partially_paid_count,
                SUM(amount_due) as total_due,
                SUM(amount_paid) as total_collected,
                SUM(amount_due - amount_paid) as outstanding_balance
            FROM payments 
            WHERE 1=1
        `;
        const values = [];

        if (tenantId) {
            query += ` AND tenant_id = $${values.length + 1}`;
            values.push(tenantId);
        }
        if (apartmentId) {
            query += ` AND apartment_id = $${values.length + 1}`;
            values.push(apartmentId);
        }
        if (startDate) {
            query += ` AND due_date >= $${values.length + 1}`;
            values.push(startDate);
        }
        if (endDate) {
            query += ` AND due_date <= $${values.length + 1}`;
            values.push(endDate);
        }

        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Payment;