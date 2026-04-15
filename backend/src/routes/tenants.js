const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');
const TenantController = require('../controllers/tenantController');

// All routes require authentication and admin role
router.use(authMiddleware, requireAdmin);

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