import api from './api';

const paymentService = {
    getAllPayments: (params) =>
        api.get('/payments', { params }),

    getPaymentById: (id) =>
        api.get(`/payments/${id}`),

    createPayment: (paymentData) =>
        api.post('/payments', paymentData),

    updatePayment: (id, paymentData) =>
        api.put(`/payments/${id}`, paymentData),

    deletePayment: (id) =>
        api.delete(`/payments/${id}`),
};

export default paymentService;