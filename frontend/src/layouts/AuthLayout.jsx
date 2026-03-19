import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;