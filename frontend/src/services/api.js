import axios from 'axios';
import { API_ENDPOINT, API_TIMEOUT } from './config';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: API_ENDPOINT,
    timeout: API_TIMEOUT,
    headers:{
        'Content-Type': 'application/json',
    },
});

// add request interceptor to include auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);  

// add response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            //handle unauthorized error, e.g., redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
