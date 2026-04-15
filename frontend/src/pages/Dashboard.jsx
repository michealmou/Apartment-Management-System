import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tenants</h3>
                    <p className="text-4xl font-bold text-primary">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Payments</h3>
                    <p className="text-4xl font-bold text-warning">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                    <p className="text-4xl font-bold text-secondary">$--</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;