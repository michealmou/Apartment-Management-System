const db = require('../config/database');

class AuditLogger {
    static async log(logData) {
        const {
            admin_id,
            action, //CREATE, UPDATE, DELETE. READ_LIST, READ_DETAIL
            entity_type, //'tenant'
            entity_id,
            old_values,
            new_values,
            ip_address,
            user_agent,
            notes,
        } = logData;

        const query = `
        INSERT INTO admin_logs (
            admin_id, action, entity_type, entity_id,
            old_values, new_values, ip_address, user_agent, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;

        try {
            await db.query(query, [
                admin_id,
                action,
                entity_type,
                entity_id,
                JSON.stringify(old_values),
                JSON.stringify(new_values),
                ip_address,
                user_agent,
                notes,
            ]);
        } catch (error) {
            console.error('Audit logging failed: ', error);
            //dont throw - logging shouldnt break the request
        }
    }

    static getClientIp(req) {
        return (
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection?.remoteAddress ||
            'unknown'
        );
    }
}

module.exports = AuditLogger;