import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate('/payments')}
                className="text-primary hover:underline mb-4"
            >
                ← Back to Payments
            </button>
            <h1 className="text-3xl font-bold mb-6">Payment Details - ID: {id}</h1>
            <p className="text-gray-600">Loading payment details...</p>
        </div>
    );
};

export default PaymentDetails;