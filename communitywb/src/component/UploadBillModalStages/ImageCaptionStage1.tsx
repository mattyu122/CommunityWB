import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../css/UploadModal.module.css';
interface Stage1Props {
    file: File | null;
    caption: string;
    imagePreview: string | null;
    setFile: (file: File | null) => void;
    setCaption: (caption: string) => void;
    setImagePreview: (imagePreview: string | null) => void;
    }
    const ImageCaptionStage1:React.FC<Stage1Props> = ({file, caption, imagePreview, setFile, setCaption, setImagePreview}) => {
    const {register,formState:{errors}} = useForm();
    // const { mutate: addHandBill,isPending, isSuccess } = useAddHandBillMutation();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // const uploadFiles = async (data:{file: File | null; caption:string;}) => {
    //     const handBill = new HandBill(data.file!);
    //     const formData = handBill.toFormData();
    //     addHandBill(formData);
    //     }
    const handleChoosePhotoButtonClick = () => {
        if (fileInputRef.current) {
            console.log('File input clicked');
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImagePreview(imageUrl);
        }
        };

    return (
        <div className={styles.card}>
            <div className={styles.leftImg}>
                {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                ) : (
                <img
                    src="https://via.placeholder.com/150"
                    alt="Default placeholder"
                    className={styles.previewImage}
                />
                )}

                <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                ref={fileInputRef}
                hidden/>

                <button
                className={styles.uploadButton}
                onClick={handleChoosePhotoButtonClick}
                type="button"
                >
                Choose from computer
                </button>
            </div>
            <div>
                <form className={styles.form}>
                <div className={styles.captionWrapper}>
                <label htmlFor="file" className={styles.caption}>Caption</label>
                <textarea {...register("caption", {required: true})} placeholder="caption" value={caption} onChange={(e)=> setCaption(e.target.value)}/>
                {errors.caption && <span className={styles.errorText}>Caption is required</span>}
                </div>
                {/* <input type="submit" value="Submit" className={styles.submitButton} disabled={isPending}/> */}
            </form>

            </div>
        </div>
    )
}

export default ImageCaptionStage1;