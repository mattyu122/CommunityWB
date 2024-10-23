import { create } from 'zustand';
import { User } from '../models/User';

interface UserState {
    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    user: User | null;
    setTokens: (accessToken: string, refreshToken: string, idToken: string) => void;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    idToken: localStorage.getItem('idToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'), // Retrieve and parse user object
    setTokens: (accessToken, refreshToken, idToken) => {
        set({ accessToken, refreshToken, idToken })
        // Store tokens securely
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('idToken', idToken);
    },
    setUser: (user) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user)); // Store user object as a string
    },
    clearUser: () => {
        set({ accessToken: null, refreshToken: null, idToken: null, user: null })
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('idToken');
    },
}));
