const db = require('../src/config/database');
const bcryptjs = require('bcryptjs');

const testLogin = async () => {
    try {
        console.log('\n🔍 LOGIN DEBUG INFO\n');
        
        // Check if admin user exists
        const userResult = await db.query(
            'SELECT id, name, email, password, role, is_active FROM users WHERE email = $1',
            ['admin@ams.com']
        );
        
        if (userResult.rows.length === 0) {
            console.log('❌ Admin user NOT found in database!');
            console.log('   Email: admin@ams.com');
            console.log('\n   Run: npm run db:seed');
            await db.end();
            process.exit(1);
        }
        
        const user = userResult.rows[0];
        console.log('✅ Admin user FOUND in database:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.is_active}`);
        console.log(`   Password Hash: ${user.password.substring(0, 30)}...`);
        
        // Test password comparison
        const testPassword = 'admin123';
        console.log(`\n🔑 Testing password: "${testPassword}"`);
        
        const isMatch = await bcryptjs.compare(testPassword, user.password);
        console.log(`   Password matches: ${isMatch ? '✅ YES' : '❌ NO'}`);
        
        if (!isMatch) {
            console.log('\n⚠️  Password mismatch! Possible causes:');
            console.log('   1. Wrong password entered');
            console.log('   2. Database corrupted - try re-seeding');
            console.log('   3. Hashing algorithm mismatch');
        } else {
            console.log('\n✅ Login should work! Check:');
            console.log('   1. Frontend API URL is correct: http://localhost:5000');
            console.log('   2. Backend is running: npm start');
            console.log('   3. Network requests (check browser DevTools)');
        }
        
        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        await db.end();
        process.exit(1);
    }
};

testLogin();
