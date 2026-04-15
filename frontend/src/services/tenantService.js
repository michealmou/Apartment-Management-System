import api from './api';

const tenantService = {
    getAllTenants: (params) =>
        api.get('/tenants', { params }),

    getTenantById: (id) =>
        api.get(`/tenants/${id}`),

    createTenant: (tenantData) =>
        api.post('/tenants', tenantData),

    updateTenant: (id, tenantData) =>
        api.put(`/tenants/${id}`, tenantData),

    deleteTenant: (id) =>
        api.delete(`/tenants/${id}`),
};

export default tenantService;