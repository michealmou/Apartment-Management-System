const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1/auth';

const testAuth = async () => {
    console.log('\n🔐 TESTING AUTH ENDPOINTS\n');
    console.log('===============================================\n');

    try {
        // Test 1: Login
        console.log('1️⃣  Testing LOGIN endpoint...');
        console.log('   URL: POST ' + API_URL + '/login');
        console.log('   Payload: { email: "admin@ams.com", password: "admin123" }\n');

        try {
            const loginResponse = await axios.post(API_URL + '/login', {
                email: 'admin@ams.com',
                password: 'admin123'
            });

            console.log('   ✅ LOGIN SUCCESS');
            console.log('   Response Status:', loginResponse.status);
            console.log('   Response Data:', JSON.stringify(loginResponse.data, null, 2));
            console.log('\n');

        } catch (loginError) {
            console.log('   ❌ LOGIN FAILED');
            console.log('   Error Status:', loginError.response?.status);
            console.log('   Error Data:', JSON.stringify(loginError.response?.data, null, 2));
            console.log('\n');
        }

        // Test 2: Register
        console.log('2️⃣  Testing REGISTER endpoint...');
        console.log('   URL: POST ' + API_URL + '/register');
        const randomEmail = `test${Date.now()}@example.com`;
        console.log('   Payload:', JSON.stringify({
            name: 'Test User',
            email: randomEmail,
            password: 'TestPass123',
            phone: '555-0000'
        }, null, 2) + '\n');

        try {
            const registerResponse = await axios.post(API_URL + '/register', {
                name: 'Test User',
                email: randomEmail,
                password: 'TestPass123',
                phone: '555-0000'
            });

            console.log('   ✅ REGISTER SUCCESS');
            console.log('   Response Status:', registerResponse.status);
            console.log('   Response Data:', JSON.stringify(registerResponse.data, null, 2));
            console.log('\n');

        } catch (registerError) {
            console.log('   ❌ REGISTER FAILED');
            console.log('   Error Status:', registerError.response?.status);
            console.log('   Error Data:', JSON.stringify(registerError.response?.data, null, 2));
            console.log('\n');
        }

        // Test 3: Health check
        console.log('3️⃣  Testing HEALTH endpoint...');
        console.log('   URL: GET http://localhost:5000/health\n');

        try {
            const healthResponse = await axios.get('http://localhost:5000/health');
            console.log('   ✅ HEALTH CHECK SUCCESS');
            console.log('   Response:', JSON.stringify(healthResponse.data, null, 2));
            console.log('\n');
        } catch (healthError) {
            console.log('   ❌ HEALTH CHECK FAILED');
            console.log('   Error:', healthError.message);
            console.log('   ⚠️  Backend might not be running!');
            console.log('   Run: npm start\n');
        }

    } catch (error) {
        console.error('Test Error:', error.message);
    }

    console.log('===============================================\n');
    process.exit(0);
};

testAuth();
