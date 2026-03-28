const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth');
const TokenUtils = require('../../src/utils/tokenUtils');

// Helper functions for backward compatibility
const generateAccessToken = (user) => TokenUtils.generateAccessToken(user.id, user.email, user.role);
const generateRefreshToken = (user) => TokenUtils.generateRefreshToken(user.id);

//mock database/auth controller

jest.mock('../../src/controllers/authController');

const authController = require('../../src/controllers/authController');

describe('Auth Routes Integration Tests', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', authRoutes);
    });

    describe('POST /auth/register', () => {
        beforeEach(() => {
            authController.register.mockClear();
        });

        it('should register a new user successfully', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                        id: '123',
                        email: 'newuser@example.com',
                        role: 'tenant'
                    },
                    accessToken: 'access_token_here',
                    refreshToken: 'refresh_token_here'
                });
            });
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                    name: 'New User',
                });

            expect(response.status).toBe(201);
            expect(response.body.user.email).toBe('newuser@example.com');
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        });

        it('should reject registration with missing email', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(400).json({
                    error: 'Email is required'
                });
            });
            const response = await request(app)
                .post('/auth/register')
                .send({
                    password: 'password123',
                    name: 'New User',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Email');
        });

        it('should reject registration with weak password', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(400).json({
                    error: 'Password must be at least 8 characters'
                });
            });
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'user@example.com',
                    password: 'weak',
                    name: "new user",
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('8 characters');
        });

        it('shouldd reject duplicate email registration', async () => {
            authController.register.mockImplementation((req, res) => {
                res.status(400).json({
                    error: 'Email already registered'
                });
            });
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password123',
                    name: 'New user',
                });
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('already registered');
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(() => {
            authController.login.mockClear();
        });

        it('should login successfully with correct credentials', async () => {
            const tokens = {
                accessToken: generateAccessToken({
                    id: '123',
                    email: 'user@example.com',
                    role: 'tenant',
                }),
                refreshToken: generateRefreshToken({
                    id: '123',
                    email: 'user@example.com',
                    role: 'tenant',
                }),
            };

            authController.login.mockImplementation((req, res) => {
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: '123',
                        email: 'user@example.com',
                        role: 'tenant',
                    },
                    ...tokens,
                });
            });

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'user@example.com',
                    password: 'CorrectPassword123!',
                });

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe('user@example.com');
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        });

        it('should reject login with invalid email', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Invalid credentials'
                });
            });

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'invalid@example.com',
                    password: 'passwordwrong',
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toContain('Invalid');
        });

        it('should reject login with wrong password', async () => {

            authController.login.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Invalid credentials'
                });
            });

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'user@example.com',
                    password: 'WrongPassword!',
                });

            expect(response.status).toBe(401);
        });

        it('should reject login with missing fields', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(400).json({
                    error: 'Email and password are required'
                });
            });
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'user@example.com',
                });
            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/refresh', () => {
        beforeEach(() => {
            authController.refreshToken.mockClear();
        });

        it('should issue new access token with valid refresh token', async () => {
            const refreshToken = generateRefreshToken({
                id: '123',
                email: 'user@example.com',
                role: 'tenant',
            });

            authController.refreshToken.mockImplementation((req, res) => {
                res.status(200).json({
                    accessToken: generateAccessToken({
                        id: '123',
                        email: 'user@example.com',
                        role: 'tenant',
                    }),
                });
            });
            const response = await request(app)
                .post('/auth/refresh')
                .send({
                    refreshToken,
                });
            expect(response.status).toBe(200);
            expect(response.body.accessToken).toBeDefined();
        });

        it('should reject invalid refresh token', async () => {
            authController.refreshToken.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Invalid refresh token'
                });
            });
            const response = await request(app)
                .post('/auth/refresh')
                .send({
                    refreshToken: 'invalid.token.here'
                });
            expect(response.status).toBe(401);
        });

        it('should reject expired refresh token', async () => {
            authController.refreshToken.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Refresh token expired'
                });
            });
            const response = await request(app)
                .post('/auth/refresh')
                .send({
                    refreshToken: 'expired.token.here'
                });
            expect(response.status).toBe(401);
        });
    });

    describe('POST /auth/logout', () => {
        beforeEach(() => {
            authController.logout.mockClear();
        });

        it('should logot authticated user', async () => {
            const token = generateAccessToken({
                id: '123',
                email: 'user@example.com',
                role: 'tenant',
            });

            authController.logout.mockImplementation((req, res) => {
                res.status(200).json({
                    message: 'Logout successful'
                });
            });
            const response = await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('Logout');
        });

        it('should reject logout without authentication', async () => {
            authController.logout.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Unauthorized'
                });
            });
            const response = await request(app)
                .post('/auth/logout')
                .send({});
            expect(response.status).toBe(401);
        });
    });

    describe('GET /auth/me', () => {
        beforeEach(() => {
            authController.getCurrentUser.mockClear();
        });
        it('should return current authenticated user', async () => {
            const token = generateAccessToken({
                id: '123',
                email: 'user@example.com',
                role: 'tenant',
            });

            authController.getCurrentUser.mockImplementation((req, res) => {
                res.status(200).json({
                    user: {
                        id: '123',
                        email: 'user@example.com',
                        role: 'tenant',
                        created_at: '2024-01-01T00:00:00Z',
                    },
                });
            });
            const response = await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe('user@example.com');
        });

        it('should reject request without authentication', async () => {
            authController.getCurrentUser.mockImplementation((req, res) => {
                res.status(401).json({
                    error: 'Unauthorized'
                });
            });
            const response = await request(app) 
                .get('/auth/me')
            expect(response.status).toBe(401);
        });
    });
});