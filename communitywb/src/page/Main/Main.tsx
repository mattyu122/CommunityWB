import { UploadOutlined } from '@ant-design/icons';
import { Layout, Modal, Space } from 'antd'; // Import Modal from Ant Design
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Import the external CSS file
import TextButton from '../../component/Button/TextButton';
import { clearTokensAndUser } from '../../utils/tokenUtils';
import MainBoard from './MainBoard';
import UploadBillModal from './UploadBillModal/UploadBillModal';

const { Header, Content } = Layout;

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const onUploadBillClose = useCallback((finishedUpload: boolean) => {
        if (finishedUpload) {
            // Close the modal
            setIsModalOpen(false);
        } else {
            // Show confirmation dialog
            Modal.confirm({
                title: 'Discard Upload?',
                content: 'Are you sure you want to discard your upload? Your progress will be lost.',
                okText: 'Yes, Discard',
                cancelText: 'Cancel',
                onOk: () => {
                    // User confirmed, close the modal
                    setIsModalOpen(false);
                },
            });
        }
    }, []);

    const showUploadBillModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleLogout = () => {
        clearTokensAndUser();
        navigate('/loginSignUp');
    };

    return (
        <Layout className="app-layout">
            <Header className="app-header">
                <h1 className="app-title">Look Around</h1>
                <Space>
                    <TextButton onClick={handleLogout}>Log out</TextButton>
                    <TextButton
                        icon={<UploadOutlined />}
                        onClick={showUploadBillModal}
                    />
                </Space>
            </Header>

            <Content className="app-content">
                <MainBoard />
            </Content>

            <UploadBillModal isOpen={isModalOpen} onClose={onUploadBillClose} />
        </Layout>
    );
}

export default MainPage;