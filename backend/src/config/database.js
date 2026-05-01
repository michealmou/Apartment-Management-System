
const { Pool } = require('pg');
require('dotenv').config();

console.log('📝 Database Config:');
console.log('   Host:', process.env.DB_HOST);
console.log('   Port:', process.env.DB_PORT);
console.log('   Database:', process.env.DB_NAME);
console.log('   User:', process.env.DB_USER);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client:', err);
});

pool.on('connect', () => {
    console.log('✅ New database connection established');
});

pool.on('remove', () => {
    console.log('🔌 Database connection removed');
});

module.exports = pool;