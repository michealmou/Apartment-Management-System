import api from './api';

const paymentService = {
    // Get all payments with pagination and filters
    getPayments: (page = 1, limit = 10, filters = {}) => {
        return api.get('/payments', {
            params: {
                page,
                limit,
                ...filters
            }
        }).then(response => response.data);
    },

    // Get payments for a specific tenant
    getTenantPayments: (tenantId, page = 1, limit = 10) =>
        api.get(`/payments/tenant/${tenantId}`, {
            params: { page, limit }
        }).then(response => response.data),

    // Get a single payment by ID
    getPaymentById: (id) =>
        api.get(`/payments/${id}`).then(response => response.data),

    // Create a new payment
    createPayment: (paymentData) =>
        api.post('/payments', paymentData).then(response => response.data),

    // Update an existing payment
    updatePayment: (id, paymentData) =>
        api.put(`/payments/${id}`, paymentData).then(response => response.data),

    // Delete a payment
    deletePayment: (id) =>
        api.delete(`/payments/${id}`).then(response => response.data),

    // Record a payment transaction
    recordPayment: (recordData) =>
        api.post('/payments/record', recordData).then(response => response.data),

    // Get payment statistics
    getPaymentStats: (filters = {}) =>
        api.get('/payments/stats', {
            params: filters
        }).then(response => response.data),

    // Legacy methods for backward compatibility
    getAllPayments: (params) =>
        api.get('/payments', { params }).then(response => response.data),
};

export default paymentService;