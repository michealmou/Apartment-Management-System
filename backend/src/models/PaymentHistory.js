const db = require('../config/database');

class PaymentHistory {
    // Create payment history entry
    static async create(historyData) {
        const {
            payment_id,
            tenant_id,
            amount_paid,
            payment_date,
            payment_method,
            transaction_id,
            status,
            description,
        } = historyData;

        const query = `
            INSERT INTO payment_history (
                payment_id,
                tenant_id,
                amount_paid,
                payment_date,
                payment_method,
                transaction_id,
                status,
                description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const result = await db.query(query, [
            payment_id,
            tenant_id,
            amount_paid,
            payment_date,
            payment_method,
            transaction_id,
            status,
            description,
        ]);

        return result.rows[0];
    }

    // Get all payment history for a payment
    static async getByPaymentId(paymentId) {
        const query = `
            SELECT * FROM payment_history 
            WHERE payment_id = $1 
            ORDER BY payment_date DESC
        `;
        const result = await db.query(query, [paymentId]);
        return result.rows;
    }

    // Get payment history for a tenant
    static async getByTenantId(tenantId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT * FROM payment_history 
            WHERE tenant_id = $1 
            ORDER BY payment_date DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await db.query(query, [tenantId, limit, offset]);
        return result.rows;
    }

    // Get count of payment history for a tenant
    static async getCountByTenantId(tenantId) {
        const query = `
            SELECT COUNT(*) as total FROM payment_history 
            WHERE tenant_id = $1
        `;
        const result = await db.query(query, [tenantId]);
        return parseInt(result.rows[0].total);
    }
}

module.exports = PaymentHistory;
