// src/components/SignUp.tsx
import { Button, Form, Input, notification, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from '../../api/UserAccount/userAccountQuery';
import styles from '../../css/AuthenticationPage/SignUpPage.module.css';
import { UserSignUpDto } from '../../dto/userAccount/userSignUpDto';
const { Title, Link, Text } = Typography;

const SignUp = ({ toggleToLogin }: { toggleToLogin: () => void }) => {
    const [form] = Form.useForm();
    const { mutate: signUp} = useSignUpMutation();
    const navigate = useNavigate();
    // Function to check if the input is an email
    const isEmail = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    // Function to check if the input is a phone number
    const isPhoneNumber = (input: string) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Simple international phone number validation
        return phoneRegex.test(input);
    };

    const handleSignUp = (values: any) => {
        const { contact, password, fullname, username } = values;

        const signUpData: UserSignUpDto = {
            email: null,
            phone: null,
            password,
            fullname,
            username,
        };
        if(isEmail(contact)){
            signUpData.email = contact;
        } else if(isPhoneNumber(contact)){
            signUpData.phone = contact;
        } else {
            notification.error({
                message: 'Invalid contact information',
                description: 'Please enter a valid email or phone number',
            });
            return;
        }

        signUp(signUpData,{
            onSuccess: (message) => {

                navigate('/confirmEmail', { state: { signUpData } });
                notification.success({
                    message: 'Sign Up Successful',
                    description: message,
                });
            },
            onError: (error) => {
                notification.error({
                    message: 'Sign Up Failed',
                    description: 'An error occurred during sign-up. Please try again.',
                });
            },
        });
    }

    return (
    <div className={styles.container}>
        <div className={styles.box}>
        <Title level={1} className={styles.title}>Lookaround!</Title>
        <Text className={styles.subText}>
            Sign up to see what's happening around you!
        </Text>

        <Form
            form={form}
            name="sign-up"
            onFinish={handleSignUp}
            layout="vertical"
            className={styles.form}
        >
            <Form.Item
            name="contact"
            rules={[{ required: true, message: 'Please input your mobile number or email!' }]}
            >
            <Input placeholder="Mobile Number or Email" />
            </Form.Item>

            <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
            name="fullname"
            rules={[{ required: true, message: 'Please input your full name!' }]}
            >
            <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input placeholder="Username" />
            </Form.Item>

            {/* <Form.Item>
            <Text className={styles.terms}>
                By signing up, you agree to our{' '}
                <Link href="#">Terms</Link>, <Link href="#">Privacy Policy</Link> and{' '}
                <Link href="#">Cookies Policy</Link>.
            </Text>
            </Form.Item> */}

            <Form.Item>
            <Button htmlType="submit" block>
                Sign Up
            </Button>
            </Form.Item>
        </Form>

        <Text className={styles.loginLink}>
            Have an account? <Link onClick={toggleToLogin}>Log in</Link>
        </Text>
        </div>
    </div>
    );
};

export default SignUp;