import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="subtitle">Welcome, {user?.name}</p>
            </div>

            <div className="dashboard-content">
                <div className="stats-grid">
                    {/* Stat Cards */}
                    <div className="stat-card">
                        <h3>Total Tenants</h3>
                        <p className="stat-number">--</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Payments</h3>
                        <p className="stat-number">--</p>
                    </div>

                    <div className="stat-card">
                        <h3>Pending Payments</h3>
                        <p className="stat-number">--</p>
                    </div>

                    <div className="stat-card">
                        <h3>Active Apartments</h3>
                        <p className="stat-number">--</p>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <section className="dashboard-section">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <button className="btn btn-primary">Add New Tenant</button>
                            <button className="btn btn-secondary">View All Tenants</button>
                            <button className="btn btn-secondary">View Payments</button>
                            <button className="btn btn-secondary">Generate Reports</button>
                        </div>
                    </section>

                    <section className="dashboard-section">
                        <h2>Recent Activity</h2>
                        <p>No recent activity</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
