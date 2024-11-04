// utils/axiosInterceptor.js
import { AxiosInstance } from 'axios';
import { clearTokensAndUser, refreshAccessToken } from '../../utils/tokenUtils';
export const setupInterceptors = (client: AxiosInstance, navigateToLogin: () => void) => {
    // Request Interceptor
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } 
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 410 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return client(originalRequest);
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    clearTokensAndUser();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};