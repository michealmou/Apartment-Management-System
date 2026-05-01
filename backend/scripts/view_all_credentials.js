const db = require('../src/config/database');

const viewAllCredentials = async () => {
    try {
        const result = await db.query(`
            SELECT 
                id, 
                name, 
                email, 
                password,
                role, 
                phone, 
                is_active, 
                created_at 
            FROM users 
            ORDER BY id
        `);
        
        console.log('\n📋 ALL USER CREDENTIALS IN DATABASE:\n');
        console.log('================================================================================');
        result.rows.forEach((user, index) => {
            console.log(`\n[${index + 1}] User ID: ${user.id}`);
            console.log(`    Name: ${user.name}`);
            console.log(`    Email: ${user.email}`);
            console.log(`    Role: ${user.role}`);
            console.log(`    Phone: ${user.phone}`);
            console.log(`    Active: ${user.is_active}`);
            console.log(`    Password (hashed): ${user.password}`);
            console.log(`    Created: ${user.created_at}`);
        });
        console.log('\n================================================================================\n');
        
        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        await db.end();
        process.exit(1);
    }
};

viewAllCredentials();
