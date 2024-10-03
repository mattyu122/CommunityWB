import { EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Modal } from 'antd';
import { useCallback, useState } from 'react';
import './App.css'; // Import the external CSS file
import LocationMap from './component/LocationMap';
import MainBoardComponent from './component/MainBoard';
import UploadBillModalMain from './component/UploadBillModalStages/UploadBillModalMain';
import styles from './css/UploadModal.module.css';

const { Header, Content } = Layout;

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  
  const onClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  const handleShowMapModal = () => {
    setIsMapModalOpen(true);
  }

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1 className="app-title">Look Around</h1>
        <Button type="primary" icon={<UploadOutlined />} onClick={showModal}>
          Upload
        </Button>
        <Button type="primary" icon={<EnvironmentOutlined />} onClick={handleShowMapModal} style={{ marginLeft: '10px' }}>
            Set Location
        </Button>
      </Header>

      <Content className="app-content">
        <MainBoardComponent/>
      </Content>

      <UploadBillModalMain 
        isOpen={isModalOpen} 
        onClose={onClose} 
      />

      <Modal
          title="Set Location and Radius"
          open={isMapModalOpen}
          onCancel={handleCloseMapModal}
          footer={null}
          className={styles.modalWrapper}
          width="60vw"
        >
          <div className={styles.cardWrapper}>
            <LocationMap isOpen={isMapModalOpen} onClose={handleCloseMapModal} />
          </div>
      </Modal>
    </Layout>
  );
}

export default App;