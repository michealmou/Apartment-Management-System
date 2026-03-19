import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate('/tenants')}
                className="text-primary hover:underline mb-4"
            >
                ← Back to Tenants
            </button>
            <h1 className="text-3xl font-bold mb-6">Tenant Details - ID: {id}</h1>
            <p className="text-gray-600">Loading tenant details...</p>
        </div>
    );
};

export default TenantDetails;
