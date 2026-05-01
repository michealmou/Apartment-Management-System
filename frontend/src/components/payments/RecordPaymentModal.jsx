import React, { useState, useEffect } from 'react';
import paymentService from '../../services/paymentService';

const RecordPaymentModal = ({ isOpen, onClose, onPaymentRecorded, payment }) => {
    const [formData, setFormData] = useState({
        payment_id: '',
        tenant_id: '',
        amount_paid: '',
        payment_method: 'bank_transfer',
        transaction_id: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [paymentMethods] = useState([
        'bank_transfer',
        'cash',
        'check',
        'credit_card',
        'debit_card',
        'mobile_money',
        'other'
    ]);

    useEffect(() => {
        if (payment) {
            setFormData({
                ...formData,
                payment_id: payment.id,
                tenant_id: payment.tenant_id,
                amount_paid: ''
            });
        }
    }, [payment]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.payment_id) {
            newErrors.payment_id = 'Payment is required';
        }

        if (!formData.tenant_id) {
            newErrors.tenant_id = 'Tenant is required';
        }

        if (!formData.amount_paid || parseFloat(formData.amount_paid) <= 0) {
            newErrors.amount_paid = 'Amount must be greater than 0';
        }

        if (!formData.payment_method) {
            newErrors.payment_method = 'Payment method is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                payment_id: parseInt(formData.payment_id),
                tenant_id: parseInt(formData.tenant_id),
                amount_paid: parseFloat(formData.amount_paid),
                payment_method: formData.payment_method,
                transaction_id: formData.transaction_id || null,
                description: formData.description || null
            };

            await paymentService.recordPayment(payload);

            // Reset form
            setFormData({
                payment_id: '',
                tenant_id: '',
                amount_paid: '',
                payment_method: 'bank_transfer',
                transaction_id: '',
                description: ''
            });

            // Notify parent component
            onPaymentRecorded();

            // Close modal
            onClose();
        } catch (error) {
            console.error('Error recording payment:', error);
            setErrors({
                submit: error.response?.data?.message || 'Failed to record payment'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Record Payment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    {/* Amount Paid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Paid *
                        </label>
                        <input
                            type="number"
                            name="amount_paid"
                            value={formData.amount_paid}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            step="0.01"
                            min="0"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.amount_paid ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.amount_paid && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount_paid}</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method *
                        </label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.payment_method ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method.replace(/_/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {errors.payment_method && (
                            <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
                        )}
                    </div>

                    {/* Transaction ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction ID
                        </label>
                        <input
                            type="text"
                            name="transaction_id"
                            value={formData.transaction_id}
                            onChange={handleChange}
                            placeholder="Optional reference number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add notes (optional)"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {loading ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
