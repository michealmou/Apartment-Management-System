import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await paymentService.getAllPayments();
            setPayments(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Payments</h1>
            {error && <div className="text-danger text-sm mb-4 p-3 bg-red-50 rounded">{error}</div>}
            {loading ? (
                <div className="text-center py-12">Loading payments...</div>
            ) : (
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">Payments list will be displayed here</p>
                </div>
            )}
        </div>
    );
};

export default Payments;