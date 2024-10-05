import { EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useCallback, useState } from 'react';
import './App.css'; // Import the external CSS file
import LocationMap from './component/LocationMap';
import MainBoardComponent from './component/MainBoard';
import UploadBillModalMain from './component/UploadBillModalStages/UploadBillModalMain';

const { Header, Content } = Layout;

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  
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

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1 className="app-title">Look Around</h1>
        <Button type="primary" icon={<UploadOutlined />} onClick={showUploadBillModal}>
          Upload
        </Button>
        <Button type="primary" icon={<EnvironmentOutlined />} onClick={handleShowMapModal} style={{ marginLeft: '10px' }}>
            Set Location
        </Button>
      </Header>

      <Content className="app-content">
        <MainBoardComponent/>
      </Content>

      <UploadBillModalMain isOpen={isModalOpen} onClose={onUploadBillClose} />
      <LocationMap isOpen={isMapModalOpen} onClose={handleCloseMapModal} />
    </Layout>
  );
}

export default App;