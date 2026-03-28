const {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} = require('../../src/utils/tokenUtils');

jest.useFakeTimers();

describe('Token Expiration tests', () => {
    const testUser = {
        id: '123',
        email: 'test@example.com',
        role: 'tenant'
    };

    describe('Access Token Expiration', () => {
        it('should expire access token after configured time', () => {
            const token = generateAccessToken(testUser);
            //token valid immediately
            expect(() => verifyAccessToken(token)).not.toThrow();

            //advance time by 7 days
            jest.advanceTimersByTime(7 * 24 * 60 * 60 * 1000); //7 days in ms
            //token should now be expired
            expect(() => verifyAccessToken(token)).toThrow('Access token expired');
        });

        it('should provide useful error message on expiration', () => {
            const token = generateAccessToken(testUser);
            jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
            try {
                verifyAccessToken(token);
                fail('should have thrown an error');
            } catch (err) {
                expect(err.message).toContain('expired');
            }
        });

        it('should support parial expiration times', () => {
            const token = generateAccessToken(testUser);

            // just before expiration 
            jest.advanceTimersByTime(6.9 * 24 * 60 * 60 * 1000); //6.9 days in ms
            expect(() => verifyAccessToken(token)).not.toThrow();
            // just after expiration
            jest.advanceTimersByTime(0.2 * 24 * 60 * 60 * 1000); //0.2 days in ms
            expect(() => verifyAccessToken(token)).toThrow();
        });
    });

    describe('Refresh Token Expiration', () => {
        it('should expire refresh token after configured time', () => {
            const token = generateRefreshToken(testUser);

            expect(() => verifyRefreshToken(token)).not.toThrow();
            //advance time by 30 days
            jest.advanceTimersByTime(30 * 24 * 60 * 60 * 1000); //30 days in ms
            expect(() => verifyRefreshToken(token)).toThrow('Refresh token expired');
        });
        it('should allow refresh token for longer duration than access token', () => {
            const accessToken = generateAccessToken(testUser);
            const refreshToken = generateRefreshToken(testUser);
            //advance time by 8 days
            jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000); //8 days in ms
            expect(() => verifyAccessToken(accessToken)).toThrow();
            expect(() => verifyRefreshToken(refreshToken)).not.toThrow();
        });
    });

    afterAll(() => {
        jest.useRealTimers();
    });
});