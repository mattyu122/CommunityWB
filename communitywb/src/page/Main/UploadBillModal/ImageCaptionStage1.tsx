// src/components/ImageCaptionStage1.tsx
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Form, Input, Space, Upload } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LinkButton from '../../../component/Button/LinkButton';
import styles from '../../../css/ImageCaptionStage1.module.css';
import { useUploadBillStore } from '../../../stores/createHandBillFormStore';

const ImageCaptionStage1: React.FC = () => {
    const {
        file,
        setFile,
        caption,
        setCaption,
        imagePreview,
        setImagePreview,
    } = useUploadBillStore();

    const { register, formState: { errors } } = useForm();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [uploadFileList, setUploadFileList] = useState<RcFile[]>([]);

    const handleFileChange = (newFiles: RcFile[]) => {
        const allFiles = [...uploadFileList, ...newFiles]
        console.log("All Files:", allFiles);
        const newPreviews = allFiles.map((file) => URL.createObjectURL(file));
        setUploadFileList(allFiles);
        setImagePreview(newPreviews);
        setFile(allFiles);
        setCurrentImageIndex(0); // Reset to the first image on file change
    };

    const clearFile = () => {
        setFile(null);
        setImagePreview(null);
        setCurrentImageIndex(0);
        setUploadFileList([]); // Clear the Upload component's fileList
    };

    const handleNext = () => {
    if (imagePreview && currentImageIndex < imagePreview.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
    }
    };

    const handlePrevious = () => {
    if (imagePreview && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
    }
    };

    useEffect(() => {
        if(file == null && imagePreview == null){
            setCurrentImageIndex(0);
            setUploadFileList([]); // Clear the Upload component's fileList
        }
    }, [file, imagePreview]);

    return (
    <div className={styles.card}>
        <div className={styles.left}>
        {imagePreview && imagePreview.length > 0 ? (
            <div className={styles.imagePreviewContainer}>
            <img
                src={imagePreview[currentImageIndex]}
                alt={`Preview ${currentImageIndex}`}
                className={styles.previewImage}
            />
            {imagePreview.length > 1 && (
                <>
                {currentImageIndex !== 0 && (
                    <LinkButton
                    className={`${styles.arrow} ${styles.leftArrow}`}
                    onClick={handlePrevious}
                    disabled={currentImageIndex === 0}
                    icon={<LeftOutlined />}
                    />
                )}
                {currentImageIndex !== imagePreview.length - 1 && (
                    <LinkButton
                    className={`${styles.arrow} ${styles.rightArrow}`}
                    onClick={handleNext}
                    disabled={currentImageIndex === imagePreview.length - 1}
                    icon={<RightOutlined />}
                    />
                )}
                </>
            )}
            </div>
        ) : (
            <img
            src="https://placehold.co/400x400/cccccc/ffffff?text=Choose+a+picture"
            alt="Default placeholder"
            className={styles.previewImage}
            />
        )}
        <Space>
            <Upload
            multiple
            showUploadList={false}
            beforeUpload={() => false}
            fileList={uploadFileList}
            onChange={({ fileList }) => {
                const newFiles = fileList
                    .map((file) => file.originFileObj as RcFile)
                    .filter((file): file is RcFile => !!file);
                handleFileChange(newFiles);
            }}
            >
            <LinkButton>Pick from device</LinkButton>
            </Upload>
            <LinkButton onClick={clearFile} className={styles.clearButton}>
            Clear File
            </LinkButton>
        </Space>
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

export default React.memo(ImageCaptionStage1);