import { Button, Form, Input, notification, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfirmContactMutation } from '../api/UserAccount/userAccountQuery';
import styles from '../css/ConfirmEmailPage.module.css';
import { UserConfirmContactDto } from '../dto/userAccount/UserConfirmContactDto';
import { useUserStore } from '../stores/userStateStore';
const { Title, Text } = Typography;

const ConfirmContact = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: confirmContact } = useConfirmContactMutation();
    const { setTokens, setUser } = useUserStore();
    const { signUpData } = location.state || {};
    const handleConfirmEmail = (values: any) => {
        const { confirmationCode } = values;

        console.log('Email confirmation attempted with:', values);

        const confirmContactData: UserConfirmContactDto = {
            ...signUpData,
            confirmationCode,
        }
        confirmContact(confirmContactData, {
            onSuccess: (data) => {
                const { user, accessToken, refreshToken, idToken } = data; // Assuming these are returned by the backend

                setTokens(accessToken, refreshToken, idToken);
                setUser(user);


                notification.success({
                    message: 'Contact Confirmed',
                    description: 'Your contact has been confirmed successfully!',
                });

                navigate('/'); // Navigate to the main page
            },
            onError: (error) => {
                notification.error({
                    message: 'Email Confirmation Failed',
                    description: 'An error occurred during email confirmation. Please try again.',
                });
            },
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <Title level={1} className={styles.title}>Confirm Your Email</Title>
                <Text className={styles.subText}>
                    Please enter the confirmation code sent to your email.
                </Text>
                <Form form={form} onFinish={handleConfirmEmail} className={styles.form}>
                    <Form.Item
                        name="confirmationCode"
                        rules={[{ required: true, message: 'Please input the confirmation code!' }]}
                    >
                        <Input placeholder="Confirmation Code" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.submitButton}>
                            Confirm
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ConfirmContact;
