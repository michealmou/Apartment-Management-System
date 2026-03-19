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
        const token = localStorage.getItem('token');
        return token ? JSON.parse(atob(token.split('.')[1])) : null;
    },

    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    getToken: () => localStorage.getItem('token'),
};

export default authService;