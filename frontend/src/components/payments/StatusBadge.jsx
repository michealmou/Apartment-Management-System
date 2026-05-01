import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'partially_paid':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'unpaid':
                return 'bg-red-100 text-red-800 border border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid':
                return 'Paid';
            case 'partially_paid':
                return 'Partially Paid';
            case 'unpaid':
                return 'Unpaid';
            default:
                return status;
        }
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default StatusBadge;
