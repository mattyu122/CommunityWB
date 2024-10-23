// src/pages/LoginSignUpPage.tsx
import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const LoginSignUpPage = () => {
const [isLogin, setIsLogin] = useState(true);

const toggleToSignUp = () => setIsLogin(false);
const toggleToLogin = () => setIsLogin(true);

return (
<div>
    {isLogin ? (
    <Login toggleToSignUp={toggleToSignUp} />
    ) : (
    <SignUp toggleToLogin={toggleToLogin} />
    )}
</div>
);
};

export default LoginSignUpPage;