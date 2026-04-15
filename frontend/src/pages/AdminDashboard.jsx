import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/navigation/Sidebar';
import WelcomeSection from '../components/common/WelcomeSection';
import StatisticsCard from '../components/cards/StatisticsCard';
import dashboardService from '../services/dashboardService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalTenants: 0,
        rentCollected: 0,
        outstandingBalance: 0,
        paymentStatus: {
            paid: 0,
            pending: 0,
            overdue: 0,
            partial: 0
        }
    });

    useEffect(() => {
        fetchDashboardStats();
        // Optional: Set up polling for real-time updates (every 30 seconds)
        const interval = setInterval(fetchDashboardStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const [tenantsCount, rentData, outstandingData, statusData] = await Promise.all([
                dashboardService.getTotalTenants(),
                dashboardService.getMonthlyRentCollected(),
                dashboardService.getOutstandingBalance(),
                dashboardService.getPaymentStatusOverview()
            ]);

            setStats({
                totalTenants: tenantsCount.data.count || 0,
                rentCollected: rentData.data.totalCollected || 0,
                outstandingBalance: outstandingData.data.totalOutstanding || 0,
                paymentStatus: statusData.data || {
                    paid: 0,
                    pending: 0,
                    overdue: 0,
                    partial: 0
                }
            });
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
            setError('Failed to load dashboard statistics. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-dashboard-container">
            <Sidebar 
                isOpen={sidebarOpen} 
                onToggle={toggleSidebar}
                onLogout={handleLogout}
            />

            <div className={`admin-dashboard-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Header with hamburger menu */}
                <div className="dashboard-header">
                    <button 
                        className="hamburger-btn" 
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1>Dashboard</h1>
                </div>

                {/* Welcome Section */}
                <WelcomeSection userName={user?.name} />

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        <p>{error}</p>
                        <button onClick={fetchDashboardStats}>Retry</button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading statistics...</p>
                    </div>
                )}

                {/* Statistics Grid */}
                {!loading && (
                    <div className="statistics-grid">
                        <StatisticsCard
                            icon="👥"
                            title="Total Tenants"
                            value={stats.totalTenants}
                            subtitle="Active tenants"
                            variant="primary"
                            onClick={() => navigate('/tenants')}
                        />

                        <StatisticsCard
                            icon="💰"
                            title="Rent Collected"
                            value={`$${stats.rentCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            subtitle="This month"
                            variant="success"
                            onClick={() => navigate('/payments')}
                        />

                        <StatisticsCard
                            icon="⚠️"
                            title="Outstanding Balance"
                            value={`$${stats.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            subtitle="Due payments"
                            variant="warning"
                            onClick={() => navigate('/payments?filter=overdue')}
                        />

                        <StatisticsCard
                            icon="📊"
                            title="Payment Status"
                            value={`${Math.round((stats.paymentStatus.paid / (stats.paymentStatus.paid + stats.paymentStatus.pending + stats.paymentStatus.overdue + stats.paymentStatus.partial)) * 100) || 0}%`}
                            subtitle="On-time payments"
                            variant="info"
                            onClick={() => navigate('/payments')}
                        />
                    </div>
                )}

                {/* Payment Status Breakdown */}
                {!loading && (
                    <div className="payment-status-section">
                        <h2>Payment Status Overview</h2>
                        <div className="status-breakdown">
                            <div className="status-item paid">
                                <span className="status-label">Paid</span>
                                <span className="status-value">{stats.paymentStatus.paid}</span>
                            </div>
                            <div className="status-item pending">
                                <span className="status-label">Pending</span>
                                <span className="status-value">{stats.paymentStatus.pending}</span>
                            </div>
                            <div className="status-item overdue">
                                <span className="status-label">Overdue</span>
                                <span className="status-value">{stats.paymentStatus.overdue}</span>
                            </div>
                            <div className="status-item partial">
                                <span className="status-label">Partial</span>
                                <span className="status-value">{stats.paymentStatus.partial}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <button 
                            className="action-btn primary"
                            onClick={() => navigate('/tenants/new')}
                        >
                            ➕ Add New Tenant
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/tenants')}
                        >
                            👥 View All Tenants
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/payments')}
                        >
                            💳 View Payments
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/admin/logs')}
                        >
                            📋 Admin Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;