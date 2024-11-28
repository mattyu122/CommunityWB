// src/components/Login.tsx
import { Button, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation } from '../../api/UserAccount/userAccountQuery';
import styles from '../../css/AuthenticationPage/LoginPage.module.css';
import { UserSignInDto } from '../../dto/userAccount/UserSignInDto';
import { useUserStore } from '../../stores/userStateStore';

const { Title, Link, Text } = Typography;

const Login = ({ toggleToSignUp }: { toggleToSignUp: () => void }) => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { setTokens, setUser } = useUserStore();
    const { mutate: signIn } = useSignInMutation();
    const handleLogin = (values: any) => {
        const { identifier, password } = values;
        const signInData: UserSignInDto = {
            identifier,
            password,
        };
        signIn(signInData,{
            onSuccess: (data) => {
                const { user, accessToken, refreshToken, idToken } = data; // Assuming these are returned by the backend
                setTokens(accessToken, refreshToken, idToken);
                setUser(user);
                message.success('Sign In Successful! Getting handbills around you...');
                navigate('/'); // Navigate to the main page

            },
            onError: (error: any) => {
                message.error(`Sign In Failed: ${error.message}`);
            }
        });
    };

    return (
    <div className={styles.container}>
        <div className={styles.box}>
        <Title level={1} className={styles.title}>Lookaround!</Title>
        <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            className={styles.form}
        >
            <Form.Item
            name="identifier"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input
                placeholder="username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
            />
            </Form.Item>

            <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Item>

            <Form.Item>
            <Button htmlType="submit" block>
                Log In
            </Button>
            </Form.Item>

            <div className={styles.signupContainer}>
                <Text>Don't have an account? </Text>
                <Link onClick={toggleToSignUp}>Sign Up</Link>
            </div>
        </Form>
        </div>
    </div>
    );
};

export default Login;