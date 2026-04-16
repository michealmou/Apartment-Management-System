const request = require('supertest');
const db = require('../../src/config/database');
const TokenUtils = require('../../src/utils/tokenUtils');


let app;
let adminToken;
let adminUserId = 1; //adjust based on your test setup
let createdTenantId; // Store created tenant ID for update/delete tests

beforeAll(async () => {
    app = require('../../server');
    //generate a test admin token
    adminToken = TokenUtils.generateAccessToken(adminUserId, 'admin@test.com', 'admin');
});

afterAll(async () => {
    await db.end();
});

describe('Tenant API Endpoints', () => {
    describe('POST /api/v1/tenants', () => {
        it('should create a new tenant with valid data', async () => {
            const res = await request(app)
                .post('/api/v1/tenants')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'John Doe',
                    email: `john-${Date.now()}@example.com`,
                    phone: '555-1234',
                    unit_number: `A${Date.now()}`,
                    unit_type: 'studio',
                    lease_start_date: '2024-01-01',
                    lease_end_date: '2025-01-01',
                    rent_amount: 1500,
                    deposit_amount: 1500,
                });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('John Doe');
            createdTenantId = res.body.data.id; // Store for later tests
        });
        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/tenants')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Jane Doe',
                    email: 'invalid-email',
                    unit_number: 'B202',
                });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should reject duplicate email', async () => {
            const uniqueEmail = `duplicate-${Date.now()}@test.com`;
            const uniqueUnit = `B${Date.now()}`;
            
            //create initial tenant
            await request(app)
                .post('/api/v1/tenants')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Tenant one',
                    email: uniqueEmail,
                    unit_number: uniqueUnit,
                });

            //Try to create with same email 
            const res = await request(app)
                .post('/api/v1/tenants')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Tenant two',
                    email: uniqueEmail,
                    unit_number: `B${Date.now() + 1}`,
                });
            expect(res.status).toBe(409);
            expect(res.body.message).toContain('already exists');
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/api/v1/tenants')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    unit_number: 'C101',
                });
            expect(res.status).toBe(401);
        });

        it('should require admin role', async () => {
            const userToken = TokenUtils.generateAccessToken(2, 'user@test.com', 'user');

            const res = await request(app)
                .post('/api/v1/tenants')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    unit_number: 'C102',
                });
            expect(res.status).toBe(403);
        });
    });

    describe('GET /api/v1/tenants', () => {
        it('should retriever all tenants with pagination', async () => {
            const res = await request(app)
                .get('/api/v1/tenants?page=1&limit=10')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.pagination).toHaveProperty('page');
            expect(res.body.pagination).toHaveProperty('limit');
            expect(res.body.pagination).toHaveProperty('total');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
        it('should filter tenants by status', async () => {
            const res = await request(app)
                .get('/api/v1/tenants?status=active')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.every((t) => t.status === 'active')).toBe(true);
        });

        it('should search tenants by name', async () => {
            const res = await request(app)
                .get('/api/v1/tenants?search=John')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('GET /api/v1/tenants/:id', () => {
        it('should get tenant details by id', async () => {
            const res = await request(app)
                .get(`/api/v1/tenants/${createdTenantId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
        });

        it('should return 404 for non-existent tenant', async () => {
            const res = await request(app)
                .get('/api/v1/tenants/99909')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/v1/tenants/:id', () => {
        it('should update a tenant', async () => {
            const res = await request(app)
                .put(`/api/v1/tenants/${createdTenantId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'John Updated',
                    status: 'inactive',
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('John Updated');
        });
        it('should return 404 for non-existent tenant', async () => {
            const res = await request(app)
                .put('/api/v1/tenants/99909')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test',
                });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/v1/tenants/:id', () => {
        it('should delete a tenant', async () => {
            const res = await request(app)
                .delete(`/api/v1/tenants/${createdTenantId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 for non-existent tenant', async () => {
            const res = await request(app)
                .delete('/api/v1/tenants/99909')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
        });
    });
});
