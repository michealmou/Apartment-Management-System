const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');
const TenantController = require('../controllers/tenantController');

// All routes require authentication and admin role
router.use(authMiddleware, requireAdmin);
router.get('/stats/count', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const db = require('../config/database');
        
        const result = await db.query('SELECT COUNT(*) as count FROM tenants');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Error fetching tenant count:', error);
        res.status(500).json({ error: 'Failed to fetch tenant count' });
    }
});
// list tenants with pagination and filters and searching
router.get('/', TenantController.getAll);

// get tenant by id
router.get('/:id', TenantController.getById);

// create new tenant
router.post('/', TenantController.create);

// update tenant
router.put('/:id', TenantController.update);

// delete tenant
router.delete('/:id', TenantController.delete);

module.exports = router;