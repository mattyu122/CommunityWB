import { EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import the external CSS file
import LocationMapModal from '../component/LocationMapModal';
import MainBoard from '../component/MainBoard';
import UploadBillModal from '../component/UploadBillModal/UploadBillModal';
import { useUserStore } from '../stores/userStateStore';

const { Header, Content } = Layout;

function MainPage() {
const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
const navigate = useNavigate();
const { accessToken } = useUserStore();

const onUploadBillClose = useCallback(() => {
setIsModalOpen(false);
}, []);

const showUploadBillModal = () => {
setIsModalOpen(true);
};

const handleCloseMapModal = useCallback(() => {
setIsMapModalOpen(false);
},[]);

const handleShowMapModal = () => {
setIsMapModalOpen(true);
}

useEffect(() => {
    // if (!accessToken) {
    //     navigate('/loginSignUp'); // Redirect to login if not authenticated
    // }
}, [accessToken, navigate]);

return (
<Layout className="app-layout">
    <Header className="app-header">
    <h1 className="app-title">Look Around</h1>
    <div>
        <Button 
        type="primary" 
        icon={<EnvironmentOutlined />} 
        onClick={handleShowMapModal} 
        style={{ marginRight: '10px' }}>
        </Button>
        <Button 
        type="primary" 
        icon={<UploadOutlined />} 
        onClick={showUploadBillModal}>
        </Button>
    </div>
    </Header>

    <Content className="app-content">
    <MainBoard/>
    </Content>

    <UploadBillModal isOpen={isModalOpen} onClose={onUploadBillClose} />
    <LocationMapModal isOpen={isMapModalOpen} onClose={handleCloseMapModal} />
</Layout>
);
}

export default MainPage;