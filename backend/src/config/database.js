
const { Pool } = require('pg');
require('dotenv').config();
console.log('DB USER:', process.env.DB_USER);
console.log('DB PASS:', process.env.DB_PASSWORD);
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;