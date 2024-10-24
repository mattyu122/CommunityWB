import { UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';
import { useCallback, useState } from 'react';
import '../../App.css'; // Import the external CSS file
import { clearTokensAndUser } from '../../utils/tokenUtils';
import MainBoard from './MainBoard';
import UploadBillModal from './UploadBillModal/UploadBillModal';
const { Header, Content } = Layout;

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
    const onUploadBillClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const showUploadBillModal = useCallback(() => {
        setIsModalOpen(true);
    },[])

    // const handleCloseMapModal = useCallback(() => {
    //     setIsMapModalOpen(false);
    // }, []);

    // const handleShowMapModal = useCallback(() => {
    //     setIsMapModalOpen(true);
    // },[])

    const handleLogout = (() => {
        clearTokensAndUser();
    })

    return (
        <Layout className="app-layout">
            <Header className="app-header">
                <h1 className="app-title">Look Around</h1>
                <Space>
                    <Button type="primary" onClick={handleLogout}>Log out</Button>
                    {/* <Button
                        type="primary"
                        icon={<EnvironmentOutlined />}
                        onClick={handleShowMapModal}
                    /> */}
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={showUploadBillModal}
                    />
                </Space>
            </Header>

            <Content className="app-content">
                <MainBoard />
            </Content>

            <UploadBillModal isOpen={isModalOpen} onClose={onUploadBillClose} />
            {/* <LocationMapModal isOpen={isMapModalOpen} onClose={handleCloseMapModal} /> */}
        </Layout>
    );
}

export default MainPage;