#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔧 APARTMENT MANAGEMENT SYSTEM - STARTUP DIAGNOSTIC\n');
console.log('='.repeat(60));

// 1. Check .env file
console.log('\n1️⃣  Checking .env file...');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    console.log('   ✅ .env file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const dbConfig = lines.filter(l => l.includes('DB_'));
    console.log('   Database config:');
    dbConfig.forEach(line => {
        if (!line.includes('PASSWORD')) {
            console.log('     ', line);
        }
    });
} else {
    console.log('   ❌ .env file NOT found at', envPath);
    process.exit(1);
}

// 2. Check Node modules
console.log('\n2️⃣  Checking dependencies...');
const packageJsonPath = path.join(__dirname, '../package.json');
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesPath)) {
    console.log('   ✅ node_modules exists');
} else {
    console.log('   ❌ node_modules NOT found');
    console.log('   Run: npm install');
    process.exit(1);
}

// 3. Check PostgreSQL connection
console.log('\n3️⃣  Testing PostgreSQL connection...');
try {
    const { Pool } = require('pg');
    require('dotenv').config();
    
    const testPool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        connectionTimeout: 5000,
    });

    testPool.query('SELECT NOW()', async (err, res) => {
        if (err) {
            console.log('   ❌ PostgreSQL connection FAILED');
            console.log('   Error:', err.message);
            console.log('\n   ⚠️  Make sure:');
            console.log('      1. PostgreSQL is running');
            console.log('      2. Database exists: ' + process.env.DB_NAME);
            console.log('      3. Credentials in .env are correct');
            console.log('      4. User has permission to access database');
            await testPool.end();
            process.exit(1);
        } else {
            console.log('   ✅ PostgreSQL connection OK');
            console.log('   Server time:', res.rows[0].now);
            await testPool.end();
            
            // 4. Check port availability
            console.log('\n4️⃣  Checking port availability...');
            const port = process.env.PORT || 5000;
            const net = require('net');
            const server = net.createServer();
            
            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`   ❌ Port ${port} is already in use`);
                    console.log('   Kill the process using this port or change PORT in .env');
                    process.exit(1);
                }
            });
            
            server.once('listening', () => {
                server.close();
                console.log(`   ✅ Port ${port} is available`);
                
                // 5. All checks passed
                console.log('\n' + '='.repeat(60));
                console.log('\n✅ ALL CHECKS PASSED! Starting server...\n');
                console.log('='.repeat(60) + '\n');
                
                // Start the actual server
                require('../server.js');
            });
            
            server.listen(port);
        }
    });
} catch (err) {
    console.log('   ❌ Error during connection test:', err.message);
    process.exit(1);
}
