const jwt = require('jsonwebtoken');

class TokenUtils {
    // Generate JWT token short-lived access token
    static generateAccessToken(userId, email, role) {
        const payload = { userId, email, role };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d',
        });
    }   

    // generate refresh token long-lived refresh token
    static generateRefreshToken(userId) {
        const payload = { userId };

        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
        });
    }

    // generate both access and refresh tokens
    static generateTokenPair(userId, email, role) {
        return {
            accessToken: this.generateAccessToken(userId, email, role),
            refreshToken: this.generateRefreshToken(userId),
        };
    }

    // verify access token
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);   
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Access token expired');
            }
            throw new Error('Invalid access token');
        }
    }

    // verify refresh token
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Refresh token expired');
            }
            throw new Error('Invalid refresh token');
        }
    }
    // decode token without verifying (for extracting user info from expired tokens)
    static decodeToken(token) {
        return jwt.decode(token);
    }
}

module.exports = TokenUtils;