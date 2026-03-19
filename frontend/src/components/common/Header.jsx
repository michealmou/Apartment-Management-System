import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        🏢 AMS
                    </Link>
                    <nav className="flex items-center gap-8">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                                    Dashboard
                                </Link>
                                <Link to="/tenants" className="text-gray-600 hover:text-primary">
                                    Tenants
                                </Link>
                                <Link to="/payments" className="text-gray-600 hover:text-primary">
                                    Payments
                                </Link>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600">{user?.email}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-danger text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
