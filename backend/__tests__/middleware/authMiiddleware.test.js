const { authenticate, requireAdmin } = require('../../src/middleware/authMiddleware');
const TokenUtils = require('../../src/utils/tokenUtils');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('authenticate', () => {
        it('should attach user to request for valid token', () => {
            const token = TokenUtils.generateAccessToken('123', 'test@example.com', 'tenant');
            req.headers.authorization = `Bearer ${token}`;

            authenticate(req, res, next);

            expect(req.user).toBeDefined();
            expect(req.user.userId).toBe('123');
            expect(next).toHaveBeenCalled();
        });

        it('should reject request without authorization header', () => {
            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.any(String),
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject request with invalid Bearer format', () => {
            req.headers.authorization = 'InvalidFormat token';

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject request with malformed token', () => {
            req.headers.authorization = 'Bearer malformed.token.here';

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireAdmin', () => {
        it('should allow admin users', () => {
            const token = TokenUtils.generateAccessToken('123', 'admin@example.com', 'admin');
            req.headers.authorization = `Bearer ${token}`;

            authenticate(req, res, next);
            requireAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should reject non-admin users', () => {
            const token = TokenUtils.generateAccessToken('456', 'tenant@example.com', 'tenant');
            req.headers.authorization = `Bearer ${token}`;

            authenticate(req, res, next);
            res.status.mockClear();
            res.json.mockClear();
            next.mockClear();

            requireAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });
});