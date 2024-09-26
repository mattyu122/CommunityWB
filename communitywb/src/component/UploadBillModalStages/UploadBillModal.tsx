import { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useAddHandBillMutation } from '../../api/handbill/handBillQuery';
import styles from '../../css/UploadModal.module.css';
import HandBill from '../../DataModel/HandBill/Handbill';
import ImageCaptionStage1 from './ImageCaptionStage1';
import LocationStage2 from './LocationStage2';
Modal.setAppElement('#root'); // This is important for accessibility

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
    getCurrentLocation();
    setAddress(initialState.address);
    setImagePreview(initialState.imagePreview);
    setCurrentStage(initialState.currentStage);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(new LatLng(latitude, longitude));
          },
          (error) => {
              console.error('Error fetching user location:', error);
              setLocation(new LatLng(40.7128, -74.0060)); // Default to New York City
          }
      );
  } else {
      setLocation(new LatLng(40.7128, -74.0060)); // Default to New York City
  }
  }

  useEffect(() => {
    if (isSuccess) {
      resetForm();
      onClose();
    }
  }, [isSuccess]);


  useEffect(() => {
    getCurrentLocation()
  }, []);

  const stages = [
    <ImageCaptionStage1 file={file} caption={caption} imagePreview={imagePreview} setFile={setFile} setCaption={setCaption} setImagePreview={setImagePreview}/>,
    <LocationStage2 location={location} address={address} setLocation={setLocation} setAddress={setAddress} />
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
    if (file && caption) {
      console.log('Submitting');
      const handBill = new HandBill(file, caption, location, address);
      const formData = handBill.toFormData();
      addHandBill(formData);
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="upload-modal">
      <header className={styles.header}>
        <div className={styles.iconWrapper} onClick={onClose}>
          <img loading="lazy" src="..." className={styles.icon} alt="" />
        </div>
      </header>
      <div className={styles.cardWrapper}>
        <div className={styles.buttonGroup}>
          <button onClick={handleBack} disabled={currentStage === 0}>Back</button>
          {currentStage < stages.length - 1 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={submit}>Submit</button>
          )}
        </div>
        {stages[currentStage]}
      </div>
    </Modal>
  );
};

export default UploadBillModal;