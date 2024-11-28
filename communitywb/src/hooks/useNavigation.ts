import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigation() {
    const navigate = useNavigate();
    const navigateToLogin = useCallback(() => {
        navigate('/loginSignUp', { replace: true });
    }, [navigate]);

    return { navigateToLogin };
}