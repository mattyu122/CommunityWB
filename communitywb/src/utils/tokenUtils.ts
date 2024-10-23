import axios from 'axios';
import { useUserStore } from '../stores/userStateStore';

export const refreshAccessToken = async () => {
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

export const clearTokensAndUser = () => {
    const { clearUser } = useUserStore.getState();
    clearUser();
};