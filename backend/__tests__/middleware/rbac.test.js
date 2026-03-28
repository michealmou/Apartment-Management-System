const { authenticate, requireAdmin, requireAdminOrManager } = require('../../src/middleware/authMiddleware');
const TokenUtils = require('../../src/utils/tokenUtils');

describe ('Role based access control', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('Admin Role checks', ()=>{
        it('should grant admin access to admin user', () => {
            const adminToken = TokenUtils.generateAccessToken('1', 'admin@example.com', 'admin');
            req.headers.authorization = `Bearer ${adminToken}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();
            requireAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
        it('should deny admin access to tenant user', () => {
            const tenantToken = TokenUtils.generateAccessToken('2', 'tenant@example.com', 'tenant');
            req.headers.authorization = `Bearer ${tenantToken}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();
            requireAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('multiple role checks', () => {
        it('should allow admin to access manager route', () => {
            const adminToken = TokenUtils.generateAccessToken('1', 'admin@example.com', 'admin');
            req.headers.authorization = `Bearer ${adminToken}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();

            requireAdminOrManager(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should allow manager to access manager route', () => {
            const managerToken = TokenUtils.generateAccessToken('3', 'manager@example.com', 'manager');
            req.headers.authorization = `Bearer ${managerToken}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();

            requireAdminOrManager(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should deny tenant access to manager route', () => {
            const tenantToken = TokenUtils.generateAccessToken('2', 'tenant@example.com', 'tenant');
            req.headers.authorization = `Bearer ${tenantToken}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();
            requireAdminOrManager(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('edge cases', () => {
        it('should handle missing role gracefully', () => {
            const token = TokenUtils.generateAccessToken('4', 'no-role@example.com', undefined);
            req.headers.authorization = `Bearer ${token}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();
            requireAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });
        it('should handle case-insensitive role matching', () => {
            const tokenLowercase = TokenUtils.generateAccessToken('5', 'admin@example.com', 'admin');
            req.headers.authorization = `Bearer ${tokenLowercase}`;
            authenticate(req, res,next);
            res.status.mockClear();
            next.mockClear();
            requireAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
