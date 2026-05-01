import React, { useState, useEffect } from 'react';
import PaymentFilters from '../components/payments/PaymentFilters';
import PaymentTable from '../components/payments/PaymentTable';
import RecordPaymentModal from '../components/payments/RecordPaymentModal';
import paymentService from '../services/paymentService';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalDue: 0,
        totalCollected: 0,
        totalOutstanding: 0,
        collectionRate: 0
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        tenantId: '',
        startDate: '',
        endDate: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchPayments(1);
        fetchStats();
    }, []);

    const fetchPayments = async (page = 1, appliedFilters = filters, search = searchTerm) => {
        setLoading(true);
        try {
            const filterParams = {
                page,
                limit: itemsPerPage,
                ...(appliedFilters.status && { status: appliedFilters.status }),
                ...(appliedFilters.tenantId && { tenant_id: appliedFilters.tenantId }),
                ...(appliedFilters.startDate && { start_date: appliedFilters.startDate }),
                ...(appliedFilters.endDate && { end_date: appliedFilters.endDate }),
                ...(search && { search })
            };

            const response = await paymentService.getPayments(page, itemsPerPage, filterParams);

            setPayments(response.data || []);
            setCurrentPage(page);
            setTotalPages(response.pagination?.totalPages || 1);
            setFilteredPayments(response.data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await paymentService.getPaymentStats();
            setStats({
                totalDue: response.totalDue || 0,
                totalCollected: response.totalCollected || 0,
                totalOutstanding: response.totalOutstanding || 0,
                collectionRate: response.collectionRate || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        fetchPayments(1, newFilters, searchTerm);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
        fetchPayments(1, filters, term);
    };

    const handleRecordPayment = (payment) => {
        setSelectedPayment(payment);
        setShowModal(true);
    };

    const handlePaymentRecorded = () => {
        fetchPayments(currentPage, filters, searchTerm);
        fetchStats();
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchPayments(newPage, filters, searchTerm);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(2)}%`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                </div>

                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Due Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Due</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.totalDue)}
                                </p>
                            </div>
                            <div className="text-3xl text-red-500">📊</div>
                        </div>
                    </div>

                    {/* Total Collected Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {formatCurrency(stats.totalCollected)}
                                </p>
                            </div>
                            <div className="text-3xl text-green-500">✓</div>
                        </div>
                    </div>

                    {/* Total Outstanding Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">
                                    {formatCurrency(stats.totalOutstanding)}
                                </p>
                            </div>
                            <div className="text-3xl text-orange-500">⚠️</div>
                        </div>
                    </div>

                    {/* Collection Rate Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {formatPercentage(stats.collectionRate)}
                                </p>
                            </div>
                            <div className="text-3xl text-blue-500">📈</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <PaymentFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />

                {/* Payment Table */}
                <PaymentTable
                    payments={filteredPayments}
                    loading={loading}
                    onRecordPayment={handleRecordPayment}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Record Payment Modal */}
            <RecordPaymentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onPaymentRecorded={handlePaymentRecorded}
                payment={selectedPayment}
            />
        </div>
    );
};

export default PaymentManagement;
