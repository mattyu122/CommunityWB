import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/loginSignUp', { replace: true }); // Replace ensures no back button to the previous page
    };

    return { navigateToLogin };
};