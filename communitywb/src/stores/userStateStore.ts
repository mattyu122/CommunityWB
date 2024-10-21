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
    accessToken: null,
    refreshToken: null,
    idToken: null,
    user: null,
    setTokens: (accessToken, refreshToken, idToken) => {
        set({ accessToken, refreshToken, idToken })
        // Store tokens securely
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('idToken', idToken);
    },
    setUser: (user) => set({ user }),
    clearUser: () => set({ accessToken: null, refreshToken: null, idToken: null, user: null }),
}));