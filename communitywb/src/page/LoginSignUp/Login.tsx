// src/components/Login.tsx
import { Button, Form, Input, notification, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation } from '../../api/UserAccount/userAccountQuery';
import styles from '../../css/LoginPage.module.css';
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
        console.log('Login attempted with:', values);
        const { identifier, password } = values;
        const signInData: UserSignInDto = {
            identifier,
            password,
        };
        signIn(signInData,{
            onSuccess: (data) => {
                const { user, accessToken, refreshToken, idToken } = data; // Assuming these are returned by the backend
                console.log('sign in success', data);
                setTokens(accessToken, refreshToken, idToken);
                setUser(user);
                notification.success({
                    message: 'Sign In Successful',
                    description: "Getting handbills around you...",
                });
                navigate('/'); // Navigate to the main page

            },
            onError: (error: any) => {
                console.log('sign in error', error);
                notification.error({
                    message: 'Sign In Failed',
                    description: error.response.data.message,
                });
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
                placeholder="Phone number, username, or email"
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
            <Button type="primary" htmlType="submit" block>
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