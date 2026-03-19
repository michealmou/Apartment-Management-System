import api from './api';

const authService = {
    login: (email, password) => 
        api.post('/auth/login', { email, password }),

    register: (userData) =>
        api.post('/auth/register', userData),

    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    },

    getCurrentUser: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const payload = token.split('.')[1];
            if (!payload) return null;
            return JSON.parse(atob(payload));
        } catch (error) {
            console.warn('Invalid token in localStorage:', error);
            localStorage.removeItem('token');
            return null;
        }
    },

    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    getToken: () => localStorage.getItem('token'),
};

export default authService;