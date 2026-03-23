const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

//public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);


//protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getCurrentUser);

module.exports = router;

