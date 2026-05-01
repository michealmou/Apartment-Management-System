import React from 'react';
import StatusBadge from './StatusBadge';

const PaymentTable = ({ payments, loading, onRecordPayment, currentPage, totalPages, onPageChange }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US');
    };

    const calculateBalance = (amountDue, amountPaid) => {
        return (amountDue || 0) - (amountPaid || 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No payments found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tenant</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Apt #</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount Due</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount Paid</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Balance</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {payment.tenant_name || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {payment.apartment_number || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                    {formatCurrency(payment.amount_due)}
                                </td>
                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                    {formatCurrency(payment.amount_paid)}
                                </td>
                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                    {formatCurrency(calculateBalance(payment.amount_due, payment.amount_paid))}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <StatusBadge status={payment.status} />
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {formatDate(payment.due_date)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => onRecordPayment(payment)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                    >
                                        Record
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentTable;
