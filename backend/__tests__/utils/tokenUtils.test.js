const TokenUtils = require('../../src/utils/tokenUtils');

describe('Token Utilities', () => {
    const testUserId = '123';
    const testEmail = 'test@example.com';
    const testRole = 'tenant';

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3); // JWT should have 3 parts
        });

        it('should include user info in the token payload', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            const decoded = TokenUtils.decodeToken(token);
            expect(decoded.userId).toBe(testUserId);
            expect(decoded.email).toBe(testEmail);
            expect(decoded.role).toBe(testRole);
        });

        it('should set the correct expiration time', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            const decoded = TokenUtils.decodeToken(token);
            const now = Math.floor(Date.now() / 1000);
            const expiryTime = decoded.exp - now;

            //should be close to 7 days in seconds (allowing some leeway for processing time)
            expect(expiryTime).toBeGreaterThan(604700);
            expect(expiryTime).toBeLessThan(604900);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = TokenUtils.generateRefreshToken(testUserId);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3); // JWT should have 3 parts
        });

        it('should set correct expiration time for refresh token', () => {
            const token = TokenUtils.generateRefreshToken(testUserId);
            const decoded = TokenUtils.decodeToken(token);
            const now = Math.floor(Date.now() / 1000);
            const expiryTime = decoded.exp - now;

            //should be close to 30 days in seconds (allowing some leeway for processing time)
            expect(expiryTime).toBeGreaterThan(2591900);
            expect(expiryTime).toBeLessThan(2592100);
        });

        it('should include userId in refresh token payload', () => {
            const token = TokenUtils.generateRefreshToken(testUserId);
            const decoded = TokenUtils.decodeToken(token);
            expect(decoded.userId).toBe(testUserId);
        });
    });

    describe('generateTokenPair', () => {
        it('should generate both access and refresh tokens', () => {
            const {accessToken, refreshToken} = TokenUtils.generateTokenPair(testUserId, testEmail, testRole);
            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
        });

        it('should generate different tokens for access and refresh', () => {
            const {accessToken, refreshToken} = TokenUtils.generateTokenPair(testUserId, testEmail, testRole);

            expect(accessToken).not.toBe(refreshToken);
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify a valid access token', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            const decoded = TokenUtils.verifyAccessToken(token);

            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(testUserId);
        });

        it('should throw error for invalid token signature', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            const tamperedToken = token.slice(0, -5) + 'XXXXX';

            expect(() => TokenUtils.verifyAccessToken(tamperedToken)).toThrow();
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify a valid refresh token', () => {
            const token = TokenUtils.generateRefreshToken(testUserId);
            const decoded = TokenUtils.verifyRefreshToken(token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(testUserId);
        });

        it('should throw error for invalid refresh token', () => {
            const invalidToken = 'invalid.token.here';
            expect(() => TokenUtils.verifyRefreshToken(invalidToken)).toThrow();
        });
    });

    describe('decodeToken', () => {
        it('should decode token without verifying signature', () => {
            const token = TokenUtils.generateAccessToken(testUserId, testEmail, testRole);
            const decoded = TokenUtils.decodeToken(token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(testUserId);
        });

        it('should return null or undefined for invalid token format', () => {
            const malformedToken = 'invalid';
            const decoded = TokenUtils.decodeToken(malformedToken);
            expect(decoded).toBeFalsy();
        });
    });
});