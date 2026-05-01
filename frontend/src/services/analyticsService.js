import api from './api';

const analyticsService = {
    // Get all payments for analytics
    getAllPayments: async () => {
        try {
            const response = await api.get('/payments?limit=1000');
            return response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    // Get payment statistics
    getStatistics: async (filters = {}) => {
        try {
            const response = await api.get('/payments/stats', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },

    // Get payment trends data
    getPaymentTrends: async (startDate, endDate) => {
        try {
            const response = await api.get('/payments/trends', {
                params: { startDate, endDate },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trends:', error);
            throw error;
        }
    },

    // Get payment history for export
    getPaymentHistory: async (filters = {}) => {
        try {
            const response = await api.get('/payments/history', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    },
};

export default analyticsService;
