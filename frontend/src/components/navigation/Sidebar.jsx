import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/tenants', label: 'Tenants', icon: '👥' },
        { path: '/payments', label: 'Payments', icon: '💳' },
        { path: '/admin/logs', label: 'Admin Logs', icon: '📋' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* Sidebar Overlay for mobile */}
            {isOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={onToggle}
                    aria-hidden="true"
                ></div>
            )}

            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>AMS</h2>
                    <button 
                        className="close-btn"
                        onClick={onToggle}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button 
                        className="logout-btn"
                        onClick={onLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;