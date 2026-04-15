import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-dark mb-4">
                Welcome to Apartment Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Manage your apartments, tenants, and payments efficiently
            </p>
            {isAuthenticated ? (
                <Link
                    to="/dashboard"
                    className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600"
                >
                    Go to Dashboard
                </Link>
            ) : (
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 inline-block"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-secondary text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 inline-block"
                    >
                        Register
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;