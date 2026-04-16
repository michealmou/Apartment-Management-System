const db = require('../src/config/database');
require('dotenv').config();

async function deleteAllNonAdminData() {
    try {
        console.log('🗑️  Deleting all non-admin data...');
        console.log('');

        // Step 1: Delete all tenants
        console.log('1. Deleting all tenants...');
        const deleteTenantsResult = await db.query('DELETE FROM tenants');
        console.log(`   ✓ Deleted ${deleteTenantsResult.rowCount} tenant record(s)`);

        // Step 2: Delete all non-admin users
        console.log('2. Deleting all non-admin users...');
        const deleteUsersResult = await db.query(
            "DELETE FROM users WHERE role != 'admin'"
        );
        console.log(`   ✓ Deleted ${deleteUsersResult.rowCount} non-admin user(s)`);

        // Step 3: Show remaining admin users
        console.log('3. Remaining admin user(s):');
        const adminsResult = await db.query(
            "SELECT id, name, email, role FROM users WHERE role = 'admin'"
        );
        adminsResult.rows.forEach(admin => {
            console.log(`   - ${admin.name} (${admin.email}) - ID: ${admin.id}`);
        });

        console.log('');
        console.log('✅ Cleanup complete!');
        console.log(`   - Admin users remaining: ${adminsResult.rowCount}`);
        console.log('   - All tenants deleted');
        console.log('   - All non-admin users deleted');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

deleteAllNonAdminData();
