import { Form, Input, Upload } from 'antd'; // Ant Design imports
import React from 'react';
import { useForm } from 'react-hook-form';
import styles from '../../css/ImageCaptionStage1.module.css';

interface Stage1Props {
file: File | null;
caption: string;
imagePreview: string | null;
setFile: (file: File | null) => void;
setCaption: (caption: string) => void;
setImagePreview: (imagePreview: string | null) => void;
}

const ImageCaptionStage1: React.FC<Stage1Props> = ({
    file,
    caption,
    imagePreview,
    setFile,
    setCaption,
    setImagePreview,
}) => {
const { register, formState: { errors } } = useForm();


const handleFileChange = (file: File) => {
setFile(file);
if (file) {
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
}
return false; // Prevent automatic upload behavior of Ant Design Upload component
};

return (
<div className={styles.card}>
    <div className={styles.left}>
        {imagePreview ? (
            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
        ) : (<Upload
            beforeUpload={handleFileChange}
            showUploadList={false} // Hide default file list
            className={styles.uploadWrapper}
            >
            <img
            src="https://placehold.co/400x400/cccccc/ffffff?text=Choose+a+picture"
            alt="Default placeholder"
            className={styles.previewImage}
            />
            </Upload>)}
    </div>

    <div className={styles.right}>
    <Form layout="vertical" className={styles.form}>
        <Form.Item
        label="Caption"
        validateStatus={errors.caption ? 'error' : ''}
        help={errors.caption ? 'Caption is required' : ''}
        >
        <Input.TextArea
            {...register('caption', { required: true })}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption"
        />
        </Form.Item>
    </Form>
    </div>
</div>
);
};

export default ImageCaptionStage1;