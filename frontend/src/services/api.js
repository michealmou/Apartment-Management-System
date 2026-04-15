import axios from 'axios';
import authService from './authService';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';
//create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// add request interceptor to include auth token if available
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)    
    }
);  

// add response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = authService.getRefreshToken();
                if (refreshToken) {
                    await authService.refreshAccessToken(refreshToken);
                    // Retry the original request with new token
                    return api(originalRequest);
                }
        } catch (refreshError) {
            //refresh token failed, redirect to login
            authService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
    }
}        return Promise.reject(error);
    }
);

export default api;
