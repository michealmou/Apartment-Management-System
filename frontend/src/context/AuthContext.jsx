import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = authService.getToken();
                const storedRefreshToken = authService.getRefreshToken();
                const storeduser = authService.getStoredUser();
                if (storedToken){
                    setToken(storedToken);
                    setRefreshToken(storedRefreshToken);
                    setUser(storeduser);
                }
            } catch (err) {
                console.error('Failed to initialize auth:', err);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    // login function
    const login = useCallback(async (email, password) => {
        try{ 
            setLoading(true);
            setError(null);
            const data = await authService.login(email, password);

            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);

            return data.user;
        } catch (err) {
            const errorMessage= err.message || 'Login failed. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    //register function
    const register = useCallback(async (name, email, password, phone) => {
        try {
            setLoading(true);
            setError(null);
            const data = await authService.register(name, email, password, phone);

            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(data.user);
            return data.user;
        } catch (err) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    //logout function
    const logout = useCallback(() => {
        authService.logout();
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        setError(null);
    }, []);

    //check if user is authenticated
    const isAuthenticated = useCallback(() => {
        return !!token && !!user;
    }, [token, user]);

    //check if user is admin
    const isAdmin = useCallback(() => {
        return user?.role === 'admin';
    }, [user]);

    //check if user is tenant
    const isTenant = useCallback(() => {
        return user?.role === 'tenant';
    }, [user]);

    //refresh token function
    const refreshAccessToken = useCallback(async () => {
        if (!refreshToken) {
            logout();
            return;
        }
        try {
            const data = await authService.refreshAccessToken(refreshToken);
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        } catch (err) {
            logout();
            throw err;
        }
    }, [refreshToken, logout]);

    // Context value
    const value = {
        user,
        token,
        refreshToken,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isTenant,
        refreshAccessToken,
    };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
