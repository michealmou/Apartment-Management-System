import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';
const API_URL = `${API_BASE_URL}/api/${API_VERSION}/auth`;

const authService = {
    register: async (name, email, password, phone) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name, 
                email, 
                password,
                phone,
                role: 'tenant' // default role for frontend registration
            });

            if (response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    //login user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email, 
                password 
            });

            if (response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    //logout user
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    // refresh access token
    refreshAccessToken: async (refreshToken) => {
        try {
            const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
            if (response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
            }
            return response.data.data;
        } catch (error) {
            // If refresh fails, clear tokens and user info
            authService.logout();
            throw new Error(error.response?.data?.message || 'session expired. Please log in again.');
        }
    },

    //get current user
    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user info');
        }
    },

    //get token from local storage
    getToken: ()=> {
        return localStorage.getItem('accessToken');
    },

    //get refresh token from local storage
    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },
    //get stored user info
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    //check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

export default authService;

            




