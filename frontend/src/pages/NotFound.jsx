import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-dark mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page not found</p>
            <Link
                to="/"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;