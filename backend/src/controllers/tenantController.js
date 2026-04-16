const Tenant = require('../models/Tenant');
const Validators = require('../utils/validators');
const AuditLogger = require('../utils/auditLogger');

class TenantController {
    // GET /api/tenants - list tenants with pagination 
    static async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, status, search, unit_type } = req.query;

            const filters = {};
            if (status) filters.status = status;
            if (search) filters.search = search;
            if (unit_type) filters.unit_type = unit_type;

            const result = await Tenant.getAll(filters, parseInt(page), parseInt(limit));
            
            // Log audit only if user is admin and has valid userId
            if (req.user && req.user.role === 'admin' && req.user.userId) {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'READ_LIST',
                    entity_type: 'tenant',
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                    notes: `Filters: ${JSON.stringify(filters)}`,
                });
            }
            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }
    // GET /api/tenants/:id - get tenant details
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const tenant = await Tenant.getById(id);

            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found',
                });
            }

            // Log audit only if user is admin and has valid userId
            if (req.user && req.user.role === 'admin' && req.user.userId) {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'READ_DETAIL',
                    entity_type: 'tenant',
                    entity_id: parseInt(id),
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                });
            }

            res.json({
                success: true,
                data: tenant,
            });
        } catch (error) {   
            next(error);
        }
    }
    // POST /api/tenants - create new tenant
    static async create(req, res, next) {
        try {
            const validation = Validators.validateTenantData(req.body);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: validation.message,
                });
            }

            const tenantData = {
                ...req.body,
                user_id: req.user.id,
            };
            const tenant = await Tenant.create(tenantData);

            // Log audit only if user is admin and has valid userId
            if (req.user && req.user.role === 'admin' && req.user.userId) {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'CREATE',
                    entity_type: 'tenant',
                    entity_id: tenant.id,
                    new_values: tenant,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                });
            }
            res.status(201).json({
                success: true,
                message: 'Tenant created successfully',
                data: tenant,
            });
        } catch (error) {
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
    // PUT /api/tenants/:id - update tenant
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            // get current tenant data for comparison
            const oldTenant = await Tenant.getById(id);
            if (!oldTenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found',
                });
            }

            //validate update data
            const validation = Validators.validateTenantData(req.body, true);
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: validation.message,
                });
            }
            const updatedTenant = await Tenant.update(parseInt(id), req.body);
            // log the audit only log changed fields
            const change = {};
            for (const [key, value] of Object.entries(req.body)) {
                if (oldTenant[key] !== value) {
                    change[key] = value;
                }
            }
            
            // Log audit only if user is admin and has valid userId
            if (req.user && req.user.role === 'admin' && req.user.userId) {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'UPDATE',
                    entity_type: 'tenant',
                    entity_id: parseInt(id),
                    old_values: oldTenant,
                    new_values: change,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                });
            }
            res.json({
                success: true,
                message: 'Tenant updated successfully',
                data: updatedTenant,
            });
        } catch (error) {
            next(error);
        }
    }
    // DELETE /api/tenants/:id - delete tenant
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            // get tenant data before deletion for audit
            const tenant = await Tenant.getById(id);
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message: 'Tenant not found',
                });
            }
            await Tenant.deleteWithUser(parseInt(id));
            
            // Log audit only if user is admin and has valid userId
            if (req.user && req.user.role === 'admin' && req.user.userId) {
                await AuditLogger.log({
                    admin_id: req.user.userId,
                    action: 'DELETE',
                    entity_type: 'tenant',
                    entity_id: parseInt(id),
                    old_values: tenant,
                    ip_address: AuditLogger.getClientIp(req),
                    user_agent: req.headers['user-agent'],
                    notes: tenant.user_id ? `Associated user account (ID: ${tenant.user_id}) also deleted` : 'No associated user account'
                });
            }
            
            res.json({
                success: true,
                message: 'Tenant and associated user account deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = TenantController;