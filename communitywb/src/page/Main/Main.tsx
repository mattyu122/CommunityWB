import { UploadOutlined } from '@ant-design/icons';
import { Layout, Space } from 'antd';
import { useCallback, useState } from 'react';
import '../../App.css'; // Import the external CSS file
import TextButton from '../../component/Button/TextButton';
import { clearTokensAndUser } from '../../utils/tokenUtils';
import MainBoard from './MainBoard';
import UploadBillModal from './UploadBillModal/UploadBillModal';
const { Header, Content } = Layout;

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const onUploadBillClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const showUploadBillModal = useCallback(() => {
        setIsModalOpen(true);
    },[])

    const handleLogout = (() => {
        clearTokensAndUser();
    })

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