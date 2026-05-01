import { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import {
    calculateStatistics,
    groupPaymentsByMonth,
    getStatusBreakdown,
    filterPaymentsByDateRange,
} from '../utils/statisticsCalculator';

export const usePaymentAnalytics = () => {
    const [payments, setPayments] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [statusBreakdown, setStatusBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsService.getAllPayments();
            setPayments(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch payments');
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateAnalytics = (dataToAnalyze) => {
        const stats = calculateStatistics(dataToAnalyze);
        const trends = groupPaymentsByMonth(dataToAnalyze);
        const breakdown = getStatusBreakdown(dataToAnalyze);

        setStatistics(stats);
        setTrends(trends);
        setStatusBreakdown(breakdown);
    };

    const applyDateRangeFilter = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
        const filtered = filterPaymentsByDateRange(payments, startDate, endDate);
        updateAnalytics(filtered);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (payments.length > 0) {
            if (dateRange.startDate || dateRange.endDate) {
                const filtered = filterPaymentsByDateRange(
                    payments,
                    dateRange.startDate,
                    dateRange.endDate
                );
                updateAnalytics(filtered);
            } else {
                updateAnalytics(payments);
            }
        }
    }, [payments, dateRange.startDate, dateRange.endDate]);

    return {
        payments,
        statistics,
        trends,
        statusBreakdown,
        loading,
        error,
        applyDateRangeFilter,
        refreshPayments: fetchPayments,
    };
};
