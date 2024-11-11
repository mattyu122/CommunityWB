// src/components/UploadBillModal.tsx
import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { useAddHandBillMutation } from '../../../api/handbill/handBillQuery';
import LinkButton from '../../../component/Button/LinkButton';
import styles from '../../../css/UploadModal.module.css';
import { AddHandBillDTO, AddHandBillForm } from '../../../dto/handbill/addHandBillDto';
import { useUploadBillStore } from '../../../stores/createHandBillFormStore';
import { useUserStore } from '../../../stores/userStateStore';
import ImageCaptionStage1 from './ImageCaptionStage1';
import LocationStage2 from './LocationStage2';

interface UploadBillModalProps {
  isOpen: boolean;
  onClose: (finishedUpload: boolean) => void;
}

const UploadBillModal: React.FC<UploadBillModalProps> = ({ isOpen, onClose }) => {
  const {
    file,
    caption,
    location,
    address,
    currentStage,
    setCurrentStage,
    resetForm,
  } = useUploadBillStore();
  const { mutate: addHandBill, isSuccess, isPending } = useAddHandBillMutation();
  const { user } = useUserStore();

  useEffect(() => {
    if (isSuccess) {
      resetForm();
      onClose(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // Reset form when modal is closed
    }
  }, [isOpen]);

  const stages = [
    {
      component: <ImageCaptionStage1 />,
      title: 'Details',
    },
    {
      component: <LocationStage2 />,
      title: 'Location',
    },
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
    if (file && caption && address && location) {
      const newHandBill: AddHandBillDTO = {
        file: file,
        caption: caption,
        width: 300,
        height: 150,
        location: location,
        address: address,
        userId: user?.id || 0,
      };
      const formData = AddHandBillForm.toFormData(newHandBill);
      console.log('Submitting form data:', formData);
      addHandBill(formData);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const modalTitle = (
    <div className={styles.modalTitleWrapper}>
      <LinkButton onClick={handleBack} disabled={currentStage === 0}>
        Back
      </LinkButton>
      <div className={styles.titleCenter}>{stages[currentStage].title}</div>
      {currentStage < stages.length - 1 ? (
        <LinkButton onClick={handleNext}>Next</LinkButton>
      ) : (
        <LinkButton loading={isPending} onClick={submit}>
          Submit
        </LinkButton>
      )}
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      closable={false}
      width="60vw"
      style={{ height: '80vh' }}
    >
      <div className={styles.cardWrapper}>{stages[currentStage].component}</div>
    </Modal>
  );
};

export default UploadBillModal;