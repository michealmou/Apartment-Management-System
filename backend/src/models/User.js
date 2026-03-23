const db = require('../config/database.js');
const bycryptjs = require('bcryptjs');

class User {
    // Create a new user
    static async create(userData) {
        const { name, email, password, role = 'admin', phone, address } = userData;

        // Hash the password before storing
        const salt = await bycryptjs.genSalt(10);
        const hashedPassword = await bycryptjs.hash(password, salt);

        const query = `
      INSERT INTO users (name, email, password, role, phone, address, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, role, phone, address, is_active, created_at
    `;
        try {
            const result = await db.query(query, [
                name,
                email,
                hashedPassword,
                role,
                phone,
                address,
                true, // is_active
            ]);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Find a user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    // Verify user password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bycryptjs.compare(plainPassword, hashedPassword);
    }

    //updaate last login 
    static async updateLastLogin(userId) {
        const query = 
            `UPDATE users
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id, last_login`;
        
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    // check if user is admin
    static async isAdmin(userId) {
        const query =
            `SELECT role FROM users
            WHERE id = $1 AND is_active = true`;
        
        const result = await db.query(query, [userId]);
        return result.rows[0]?.role === 'admin';
    }
}

module.exports = User;