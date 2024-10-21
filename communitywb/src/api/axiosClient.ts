import axios from 'axios';
import { useUserStore } from '../stores/userStateStore';

export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
export const axiosClientMultipart = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Add request interceptor to attach the token from localStorage before each request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Use localStorage to get token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the token dynamically
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add request interceptor to axiosClientMultipart for multipart requests
axiosClientMultipart.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Use localStorage to get token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the token dynamically
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClientMultipart.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        console.log('axiosClientMultipart response', error);
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., redirect to login)
                console.error('Refresh token failed', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log('axiosClient response error', error);
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., redirect to login)
                console.error('Refresh token failed', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://localhost:3000/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    const { setTokens } = useUserStore.getState();
    setTokens(accessToken, newRefreshToken, localStorage.getItem('idToken') || '');

    return accessToken;
};
