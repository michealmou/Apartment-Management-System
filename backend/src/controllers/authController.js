const User = require('../models/User');
const TokenUtils = require('../utils/tokenUtils');
const Validators = require('../utils/validators');
const {
    ValidationError,
    UnauthorizedError,
    ConflictError,
} = require('../utils/authErrors');

class AuthController {
    // POST /api/v1/auth/register admin only
    static async register(req, res) {
        try {
            const { name, email, password, role, phone, address } = req.body;

            // Validate input
            const validation = Validators.validateRegistrationData({
                name,
                email,
                password,
                phone
            });
            if (!validation.valid) {
                throw new ValidationError(validation.message);
            }
            //check if email already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                throw new ConflictError('Email already in use');
            }
            // Create new user
            const newUser = await User.create({
                name,
                email,
                password,
                phone,
                address,
                role: role || 'admin', // default to admin if role not provided
            });
            //generate access and refresh tokens
            const { accessToken, refreshToken } = TokenUtils.generateTokenPair(
                newUser.id,
                newUser.email,
                newUser.role
            );
            //log action 
            console.log(`User registered: ${newUser.email} (ID: ${newUser.id})`);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: newUser,
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || 'validation error' ? error.message : 'An error occurred during registration';

            res.status(statusCode).json({
                success: false,
                message: message,
            });
        }
    }

    // POST /api/v1/auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
        // Validate input
        const validation = Validators.validateLoginData({ email, password });
        if (!validation.valid) {
            throw new ValidationError(validation.message);
        }
        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            // dont reveal whether email exists for security
            throw new UnauthorizedError('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }
        // Update last login time
        await User.updateLastLogin(user.id);
        // Generate tokens
        const { accessToken, refreshToken} = TokenUtils.generateTokenPair(
            user.id,
            user.email,
            user.role
        );
        // return user data without password
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
        };
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
                accessToken,
                refreshToken,
            },
        });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const message = error.message || 'unauthorized error' ? error.message : 'An error occurred during login';

            res.status(statusCode).json({
                success: false,
                message: message,
            });
        }
    }

    // POST /api/v1/auth/refresh-token
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw new ValidationError('Refresh token is required');
            }
            // Verify refresh token
            const decoded = TokenUtils.verifyRefreshToken(refreshToken);

            //find user and get latest info
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new UnauthorizedError('User not found');
            }
            // Generate new token pair
            const { accessToken, refreshToken: newRefreshToken } = TokenUtils.generateTokenPair(
                user.id,
                user.email,
                user.role
            );
            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken,
                    refreshToken: newRefreshToken,
                },
            });
        } catch (error) {
            const statusCode = error.statusCode || 401;
            const message = error.message || 'token refresh failed';
            res.status(statusCode).json({
                success: false,
                message: message,
            });
        }
    }
    // post /api/v1/auth/logout
    static async logout(req, res) {
        try {
            // in a real app you might blacklist the token or update a refresh token record
            //for now logout is just a front end operation token removal but we can log the action
            console.log(`User logged out: ${req.user.email} (ID: ${req.user.userId})`);
            res.json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred during logout',
            });
        }
    }
    // GET /api/auth/me - get current user info
    static async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.userId);

            if (!user) {
                throw new UnauthorizedError('User not found');
            }

            res.json({
                success: true,
                data: {user}
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'An error occurred while fetching user info',
            });
        }
    }
}

module.exports = AuthController;