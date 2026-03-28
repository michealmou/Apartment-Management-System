import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

/**
 * Wrapper component for rendering components that need Auth context and Router
 * Used in tests to avoid "useAuth must be used within an AuthProvider" errors
 */
export const AuthWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};
