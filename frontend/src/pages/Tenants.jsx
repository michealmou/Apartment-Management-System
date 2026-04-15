import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tenantService from '../services/tenantService';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await tenantService.getAllTenants();
            setTenants(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load tenants');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tenants</h1>
                <Link
                    to="/tenants/new"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Tenant
                </Link>
            </div>

            {error && <div className="text-danger text-sm mb-4 p-3 bg-red-50 rounded">{error}</div>}

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-600">
                                        No tenants found
                                    </td>
                                </tr>
                            ) : (
                                tenants.map((tenant) => (
                                    <tr key={tenant.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{tenant.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.unit}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <Link
                                                to={`/tenants/${tenant.id}`}
                                                className="text-primary hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tenants;
