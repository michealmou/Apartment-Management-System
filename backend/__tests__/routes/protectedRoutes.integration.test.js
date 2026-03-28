const request = require('supertest');
const express = require('express');
const { authenticate, requireAdmin } = require('../../src/middleware/authMiddleware');
const TokenUtils = require('../../src/utils/tokenUtils');

describe('protected routes integration tests', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        //protected admin route

        app.get('/admin/dashboard', authenticate, requireAdmin, (req, res) => {
            res.json({
                message: 'Admin dashboard',
                user: req.user
            });
        });
        //protected tenant route
        app.get('/tenant/dashboard', authenticate, (req, res) => {
            res.json({
                message: 'Tenant dashboard',
                user: req.user
            });
        });

        //public route
        app.get('/public', (req, res) => {
            res.json({
                message: 'Public content'
            });
        });
    });

    describe('Access control', () => {
        it('should allow authenticated admin to access admin route', async () => {
            const adminToken = TokenUtils.generateAccessToken('1', 'admin@example.com', 'admin');
            const response = await request(app)
                .get('/admin/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            expect(response.body.user.role).toBe('admin');
        });

        it('should deny tenant access to admin routes', async () => {
            const tenantToken = TokenUtils.generateAccessToken('2', 'tenant@example.com', 'tenant');
            const response = await request(app)
                .get('/admin/dashboard')
                .set('Authorization', `Bearer ${tenantToken}`);
            expect(response.status).toBe(403);
        });

        it('should allow authenticated tenant to access tenant route', async () => {
            const tenantToken = TokenUtils.generateAccessToken('2', 'tenant@example.com', 'tenant');
            const response = await request(app)
                .get('/tenant/dashboard')
                .set('Authorization', `Bearer ${tenantToken}`);
            expect(response.status).toBe(200);
            expect(response.body.user.role).toBe('tenant');
        });

        it('should deny unauthenticated access to protected routes', async () => {
            const response = await request(app)
                .get('/admin/dashboard');
            expect(response.status).toBe(401);
        });

        it('should allow unauthenticated access to public routes', async () => {
            const response = await request(app)
                .get('/public');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Public content');
        });
        it('should handle invalid token format', async () => {
            const response = await request(app)
                .get('/tenant/dashboard')
                .set('Authorization', 'InvalidFormat token');
            expect(response.status).toBe(401);
        });
    });
});