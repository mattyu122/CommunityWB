import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import styles from '../css/UploadModal.module.css';
Modal.setAppElement('#root'); // This is important for accessibility

interface UploadBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { file: File | null; title: string; description: string; height: number; width: number; }) => void;
  }
const UploadBillModal:React.FC<UploadBillModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(150);

  const {register,handleSubmit,watch,formState:{errors}} = useForm();
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const submit = () => {
    if (file && title && description) {
      onSubmit({ file, title, description, height, width });
      onClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="upload-modal">
        <div className={styles.cardWrapper}>
            <article className={styles.card}>
              <form onSubmit={handleSubmit(submit)}>
                <header className={styles.header}>
                    <div className={styles.iconWrapper} onClick={onClose}>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c846163d211f91ff8b219251504b91ed965281baa5ee14cfead241dd9be159e2?apiKey=090d3fb59f494e8e8e95463164786b54&" className={styles.icon} alt="" />
                    </div>
                    <h2 className={styles.title}>{title}</h2>
                </header>
                <p className={styles.description}>{description}</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.closeButton} onClick={onClose}>
                        Close
                    </button>
                    <input type="submit" value="Submit" className={styles.submitButton}/>
                </div>
              </form>
            </article>
        </div>
    </Modal>
  );
};

export default UploadBillModal;