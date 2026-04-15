import api from './api';

const dashboardService = {
    /**
     * Get total number of tenants
     */
    getTotalTenants: () =>
        api.get('/tenants/stats/count').catch(() => ({ data: { count: 0 } })),

    /**
     * Get total rent collected for current month
     */
    getMonthlyRentCollected: () =>
        api.get('/payments/stats/monthly-collected').catch(() => ({ data: { totalCollected: 0 } })),

    /**
     * Get total outstanding balance
     */
    getOutstandingBalance: () =>
        api.get('/payments/stats/outstanding').catch(() => ({ data: { totalOutstanding: 0 } })),

    /**
     * Get payment status overview (Paid, Pending, Overdue, Partial)
     */
    getPaymentStatusOverview: () =>
        api.get('/payments/stats/status-overview').catch(() => ({
            data: {
                paid: 0,
                pending: 0,
                overdue: 0,
                partial: 0
            }
        })),

    /**
     * Get recent activity log
     */
    getRecentActivity: (limit = 10) =>
        api.get('/admin/logs/recent', { params: { limit } }).catch(() => ({ data: [] })),
};

export default dashboardService;