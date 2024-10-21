// src/pages/LoginSignUpPage.tsx
import { useState } from 'react';
import Login from '../component/Login';
import SignUp from '../component/SignUp';

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