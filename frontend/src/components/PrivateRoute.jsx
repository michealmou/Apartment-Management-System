import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (<div className = "flex items-center justify-center min-h-screen">
            <div className = "text-center">
                <div className= "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className = "mt-2 text-gray-600">Loading...</p>
            </div>
        </div>
    );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace/>;
};

export default PrivateRoute;
