import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';
import { useAddHandBillMutation } from '../../api/handbill/handBillQuery';
import styles from '../../css/UploadModal.module.css';
import { AddHandBillDTO, AddHandBillForm } from '../../dto/handbill/addHandBillDto';
import ImageCaptionStage1 from './ImageCaptionStage1';
import LocationStage2 from './LocationStage2';

interface UploadBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define initial state
const initialState = {
  file: null as File | null,
  caption: '',
  location: new LatLng(40.7128, -74.0060),
  address: '',
  imagePreview: null as string | null,
  currentStage: 0
};

const UploadBillModal: React.FC<UploadBillModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(initialState.file);
  const [caption, setCaption] = useState<string>(initialState.caption);
  const [location, setLocation] = useState<LatLng | null>(initialState.location);
  const [address, setAddress] = useState<string>(initialState.address);
  const [imagePreview, setImagePreview] = useState<string | null>(initialState.imagePreview);
  const [currentStage, setCurrentStage] = useState<number>(initialState.currentStage);
  const { mutate: addHandBill, isSuccess } = useAddHandBillMutation();

  // Reset form function
  const resetForm = () => {
    setFile(initialState.file);
    setCaption(initialState.caption);
    setAddress(initialState.address);
    setLocation(initialState.location);
    setImagePreview(initialState.imagePreview);
    setCurrentStage(initialState.currentStage);
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm();
      onClose();
    }
  }, [isSuccess]);



  const stages = [
    {
      component:<ImageCaptionStage1
                  file={file}
                  caption={caption}
                  imagePreview={imagePreview}
                  setFile={setFile}
                  setCaption={setCaption}
                  setImagePreview={setImagePreview}
                />,
      title: 'Details'
    }
    ,
    {
      component: <LocationStage2
                    location={location}
                    address={address}
                    setLocation={setLocation}
                    setAddress={setAddress}
                  />,
      title: 'Location'
    }
  ];

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const submit = async () => {
    if (file && caption && address) {
      const newHandBill: AddHandBillDTO = {
        file: file,
        caption: caption,
        width: 300,
        height: 150,
        location: location, 
        address: address,
      };
      const formData = AddHandBillForm.toFormData(newHandBill);
      addHandBill(formData);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const modalTitle = (
    <div className={styles.modalTitleWrapper}>
      <Button onClick={handleBack} disabled={currentStage === 0}>
        Back
      </Button>
      <div className={styles.titleCenter}>{stages[currentStage].title}</div>
      {currentStage < stages.length - 1 ? (
        <Button type="primary" onClick={handleNext}>
          Next
        </Button>
      ) : (
        <Button type="primary" onClick={submit}>
          Submit
        </Button>
      )}
    </div>
  );

  return (
    <>
      {isOpen && (
        <CloseOutlined 
          className={styles.closeButton} // Use the grand close button class
          onClick={onClose}
          />
      )}
      <Modal
        title={modalTitle}
        open={isOpen}
        onCancel={onClose}
        footer={null} // Remove default footer buttons
        closable={false} // Hide default close button
        width="60vw"
      >
        <div className={styles.cardWrapper}>
          {stages[currentStage].component}
        </div>
      </Modal>
    </>
  );
};

export default UploadBillModal;