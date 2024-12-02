// utils/axiosInterceptor.ts
import { AxiosInstance } from 'axios';
import { clearTokensAndUser, refreshAccessToken } from '../../utils/tokenUtils';

export const setupInterceptors = (client: AxiosInstance, navigateToLogin: () => void) => {
    // Request Interceptor
    client.interceptors.request.use(
        (config) => {
            if (config.url && config.url.includes('locationiq.com')) {
                return config;
            }
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
                    navigateToLogin();
                    return Promise.reject(refreshError);
                }
            } else if (error.response.status === 401) {
                console.log('401 Unauthorized', error);
                // Handle 401 Unauthorized
                clearTokensAndUser();
                navigateToLogin();
                return Promise.reject(error);
            }
            return Promise.reject(error);
        }
    );
};