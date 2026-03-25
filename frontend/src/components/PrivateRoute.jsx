import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, loading, user } = useAuth();

    //show loading while initial auth check
    if (loading) {
        return (<div className = "flex items-center justify-center min-h-screen">
            <div className = "text-center">
                <div className= "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className = "mt-2 text-gray-600">Loading...</p>
            </div>
        </div>
    );
    }
    //not authenticated, redirect to login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    //check role if required
    if (requiredRole) {
        if (Array.isArray(requiredRole)) {
            //check if user has any of the required roles
            if (!requiredRole.includes(user?.role)) {
                return <Navigate to="/unauthorized" replace />;
            }
        } else {
            //check if user has the required role
            if (user?.role !== requiredRole) {
                return <Navigate to="/unauthorized" replace />;
            }
        }
    }
    // authenticated and authorized, render the child component
    return children;
};
export default PrivateRoute;
