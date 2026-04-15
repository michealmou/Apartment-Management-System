import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    if (!isAuthenticated()) {
        return null; // Don't render header if not authenticated
    }
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <Link to="/">Apartment Management</Link>
                </div>

                <nav className="header-nav">
                    <ul>
                        {isAdmin() ? (
                            <>
                                <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                                <li><Link to="/admin/users">Users</Link></li>
                                <li><Link to="/admin/tenants">Tenants</Link></li>
                                <li><Link to="/admin/payments">Payments</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/tenants">My Info</Link></li>
                                <li><Link to="/payments">Payments</Link></li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="header-user">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">({user?.role})</span>
                    <button onClick={handleLogout} className="btn btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
