const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');

const runMigrations = async () => {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('Running database migrations...');
    try {
        for (const file of files) {
            if (file.endsWith('.sql')) {
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');
                try {
                    await db.query(sql);
                    console.log(`✅ Successfully ran migration: ${file}`);
                } catch (error) {
                    // Allow "already exists" errors since migrations use IF NOT EXISTS
                    if (error.message && error.message.includes('already exists')) {
                        console.log(`⚠️  Migration ${file}: Table already exists (skipped)`);
                    } else {
                        console.error(`❌ Error running migration ${file}:`, error);
                        await db.end();
                        process.exit(1);
                    }
                }
            }
        }
        console.log('All migrations completed successfully!');
        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('Fatal error during migrations:', error);
        await db.end();
        process.exit(1);
    }
}
runMigrations();