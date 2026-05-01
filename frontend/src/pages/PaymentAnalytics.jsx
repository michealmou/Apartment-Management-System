import React from 'react';
import StatisticsCards from '../components/analytics/StatisticsCards';
import PaymentStatusChart from '../components/analytics/PaymentStatusChart';
import CollectionTrendsChart from '../components/analytics/CollectionTrendsChart';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import { usePaymentAnalytics } from '../hooks/usePaymentAnalytics';
import { exportDetailedAnalyticsToPDF } from '../utils/pdfGenerator';

const PaymentAnalytics = () => {
    const {
        statistics,
        trends,
        statusBreakdown,
        loading,
        error,
        applyDateRangeFilter,
    } = usePaymentAnalytics();

    const handleExport = async (startDate, endDate) => {
        try {
            const result = exportDetailedAnalyticsToPDF(
                statistics,
                statusBreakdown,
                `payment-analytics-${new Date().toISOString().split('T')[0]}.pdf`
            );

            if (result.success) {
                alert('PDF exported successfully!');
            } else {
                alert(`Export failed: ${result.message}`);
            }
        } catch (err) {
            console.error('Error exporting:', err);
            alert('Error exporting PDF');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Payment Analytics</h1>
                    <p className="text-gray-600 mt-2">Track payment trends and statistics</p>
                </div>

                {/* Filters */}
                <AnalyticsFilters
                    onDateRangeChange={applyDateRangeFilter}
                    onExport={handleExport}
                />

                {/* Statistics Cards */}
                {statistics && <StatisticsCards statistics={statistics} />}

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Status Breakdown Chart */}
                    <PaymentStatusChart data={statusBreakdown} />

                    {/* Trends Chart */}
                    <CollectionTrendsChart data={trends} />
                </div>

                {/* Summary Statistics */}
                {statistics && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statistics.totalPayments}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Average Payment</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${statistics.averagePayment.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status Breakdown</p>
                                <p className="text-sm text-gray-700">
                                    Paid: {statistics.paidCount} | Partial: {statistics.partiallyPaidCount} |
                                    Unpaid: {statistics.unpaidCount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentAnalytics;
