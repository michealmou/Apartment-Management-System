const TokenUtils = require('../utils/tokenUtils');

//middleware to authenticate user using JWT token
const authMiddleware = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader){
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing',
            });
        }
        //extract the token from bearer token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'invalid token format',
            });
        }
        // Verify the token
        const decoded = TokenUtils.verifyAccessToken(token);
        // Attach user info to the request object
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message || 'token verification failed',
            });
        }   
};

//middleware to authorize admin users
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
        });
    }
    next();
};

// middleware to check if user is admin or manager 
const requireAdminOrManager = (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'insufficient permissions. Admin or Manager access required',
        });
    }
    next();
};

module.exports = {
    authMiddleware,
    requireAdmin,
    requireAdminOrManager,
};