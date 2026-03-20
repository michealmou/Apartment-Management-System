const { type } = require('node:os');
const db = require('../src/config/database.js');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database...\n');

        // Check if admin already exists
        const existingAdmin = await db.query(
            'SELECT id FROM users WHERE email = $1',
            ['admin@ams.com']
        );

        if (existingAdmin.rows.length > 0) {
            console.log('✅ Database already seeded, skipping...');
            process.exit(0);
        }

        //insert admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminResult = await db.query(
            'INSERT INTO users (name, email, password, role, phone, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',['Admin', 'admin@ams.com', hashedPassword, 'admin', '555-0001', true]
        );
        const adminId = adminResult.rows[0].id;
        console.log(`Admin user created with ID: ${adminId}`);

        //insert sample tenants
        const tenantData = [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '555-1234',
                unit: 'A101',
                type: 'apartment',
                rent: 1200,
                deposit: 1200,
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '555-5678',
                unit: 'B202',
                type: 'apartment',
                rent: 1500,
                deposit: 1500,
            },
            {
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                phone: '555-9012',
                unit: 'C303',
                type: 'apartment',
                rent: 1000,
                deposit: 1000,
            },
            {
                name: 'Alice Williams',
                email: 'alice.williams@example.com',
                phone: '555-3456',
                unit: 'D404',
                type: 'apartment',
                rent: 1300,
                deposit: 1300,
            }
        ];
        const tenantIds = [];
        for (const tenant of tenantData) {
            const result = await db.query(
                'INSERT INTO tenants (user_id, name, email, phone, unit_number, unit_type, rent_amount, deposit_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
                [adminId, tenant.name, tenant.email, tenant.phone, tenant.unit, tenant.type, tenant.rent, tenant.deposit, 'active']
            );
            tenantIds.push(result.rows[0].id);
            console.log(`Tenant ${tenant.name} created with ID: ${result.rows[0].id}`);
        }
        console.log('Database seeding completed successfully!');
        const today = new Date();
        for (let i= 0; i< tenantIds.length; i++) {
            const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 1); // next month 1st

            await db.query(
                'INSERT INTO payments (tenant_id, amount, due_date, status) VALUES ($1, $2, $3, $4)',
                [tenantIds[i], tenantData[i].rent, dueDate, i % 2 === 0 ? 'pending' : 'paid']
            );
        }
        console.log('sample payments created');
        await db.query(
            'INSERT INTO admin_logs (admin_id, action, entity_type, notes) values ( $1, $2, $3, $4)', [adminId, 'DATABASE_SEEDED', 'SYSTEM', 'Database seeded with initial data']
        );
        console.log('Admin log entry created');
        console.log('All done!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();