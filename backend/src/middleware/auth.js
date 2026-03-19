const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Expecting

        if (!token) {
            return res.status(401).jason({
                success: false,
                message: 'No token provided, authorization denied',
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token, authorization denied',
        });
    }
};

module.exports = authMiddleware;