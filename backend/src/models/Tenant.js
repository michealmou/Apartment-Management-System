const db = require('../config/database');

class Tenant {
    // get all tenants with pagination and filters
    static async getAll(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM tenants WHERE 1=1';
        const params = [];

        // Add filters to the query
        if (filters.status) {
            params.push(filters.status);
            query += ` AND status = $${params.length}`;
        }
        if (filters.search) {
            params.push(`%${filters.search}%`);
            query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR unit_number ILIKE $${params.length})`;
        }
        if (filters.unit_type) {
            params.push(filters.unit_type);
            query += ` AND unit_type = $${params.length}`;
        }
        //count total records
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await db.query(countQuery, params);
        const total = parseInt(countResult.rows[0].total);
        //  get paginated results
        params.push(limit);
        const limitParam = params.length;
        params.push(offset);
        const offsetParam = params.length;
        query += ` ORDER BY created_at DESC LIMIT $${limitParam} OFFSET $${offsetParam}`;
        const result = await db.query(query, params);
        return {
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // get tenant by id
    static async getById(id) {
        const query = 'SELECT * FROM tenants WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
    // create new tenant
    static async create(tenantData) {
        const {
            user_id,
            name,
            email,
            phone,
            unit_number,
            unit_type,
            lease_start_date,
            lease_end_date,
            rent_amount,
            deposit_amount,
            notes,
        }= tenantData;
        const query = `
            INSERT INTO tenants (
                user_id,
                name,
                email,
                phone,
                unit_number,
                unit_type,
                lease_start_date,
                lease_end_date,
                rent_amount,
                deposit_amount,
                notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;

        try {
            const result = await db.query(query, [
                user_id,
                name,
                email,
                phone,
                unit_number,
                unit_type,
                lease_start_date,
                lease_end_date,
                rent_amount,
                deposit_amount,
                notes,
            ]);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                //unique constraint violation
                throw new Error('Email or unit number already exists');
            }
            throw error;
        }
    }
    //update tenant
    static async update(id, updates) {
        const allowedFields = [
            'name',
            'email',
            'phone',
            'unit_type',
            'lease_start_date',
            'lease_end_date',
            'rent_amount',
            'deposit_amount',
            'status',
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

        values.push(id);
        const query = ` 
        UPDATE tenants 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }
    // delete tenant
    static async delete(id) {
        const query = `
            DELETE FROM tenants 
            WHERE id = $1 
            RETURNING id, user_id
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // delete tenant and associated user account
    static async deleteWithUser(id) {
        // Get tenant to find user_id
        const getTenantQuery = 'SELECT user_id FROM tenants WHERE id = $1';
        const tenantResult = await db.query(getTenantQuery, [id]);
        
        if (!tenantResult.rows[0]) {
            throw new Error('Tenant not found');
        }

        const userId = tenantResult.rows[0].user_id;

        // Delete tenant first (will cascade if configured, but we're explicit here)
        const deleteTenantQuery = 'DELETE FROM tenants WHERE id = $1';
        await db.query(deleteTenantQuery, [id]);

        // Delete associated user account
        if (userId) {
            const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
            await db.query(deleteUserQuery, [userId]);
        }

        return { id, user_id: userId };
    }
}

module.exports = Tenant;