import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Carousel, Modal } from "antd";
import React, { useRef, useState } from "react";
import LinkButton from "../../../../component/Button/LinkButton";
import styles from "../../../../css/HandBillModal/ConfirmMediaUploadModal.module.css";

interface ConfirmModalProps {
isVisible: boolean;
mediaPreview: string[];
onClose: () => void;
uploadButton: React.ReactNode;
onConfirm: () => void; // Add onConfirm prop
}

const ConfirmMediaUploadModal: React.FC<ConfirmModalProps> = ({
isVisible,
mediaPreview,
onClose,
uploadButton,
onConfirm, // Destructure onConfirm
}) => {
const confirmCarouselRef = useRef<any>(null);
const [currentPreviewImageIndex, setCurrentPreviewImageIndex] = useState(0);

const confirmGoToNext = () => {
confirmCarouselRef.current?.next();
};

const confirmGoToPrevious = () => {
confirmCarouselRef.current?.prev();
};

const setConfirmCarouselAfterChange = (index: number) => {
setCurrentPreviewImageIndex(index);
};

return (
<Modal open={isVisible} onCancel={onClose} footer={null} width="60vw">
    <div className={styles.carouselContainer}>
        {mediaPreview.length > 0 && (
            <>
            {currentPreviewImageIndex > 0 && (
                <LinkButton
                className={`${styles.arrow} ${styles.leftArrow}`}
                icon={<LeftOutlined />}
                onClick={confirmGoToPrevious}
                />
            )}
            <Carousel
                ref={confirmCarouselRef}
                infinite={false}
                afterChange={setConfirmCarouselAfterChange}
            >
                {mediaPreview.map((fileUrl, index) => (
                <div key={index} className={styles.carouselItem}>
                    {fileUrl.endsWith(".mp4") ? (
                    <video
                        src={fileUrl}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                    ) : (
                    <img
                        className={styles.reviewImg}
                        src={fileUrl}
                        alt={`Media ${index}`}
                    />
                    )}
                </div>
                ))}
            </Carousel>
            {currentPreviewImageIndex < mediaPreview.length - 1 && (
                <LinkButton
                className={`${styles.arrow} ${styles.rightArrow}`}
                icon={<RightOutlined />}
                onClick={confirmGoToNext}
                />
            )}
            </>
        )}
        <div className={styles.buttonContainer}>
            {uploadButton}
            <Button onClick={onConfirm} type="primary" style={{ marginLeft: "10px" }}>
                Confirm
            </Button>
        </div>
    </div>
</Modal>
);
};

export default ConfirmMediaUploadModal;