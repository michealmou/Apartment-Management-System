const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

//placeholder routes for tenants
router.get('/', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Get all tenants - to be implemented',
    });
});

router.post('/', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Create tenant - to be implemented',
    });
});

router.get('/:id', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Get tenant ${req.params.id} - to be implemented',
    });
});

router.put('/:id', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Update tenant ${req.params.id} - to be implemented',
    });
});

router.delete('/:id', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Delete tenant ${req.params.id} - to be implemented',
    });
});

module.exports = router;