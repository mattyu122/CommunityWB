import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Carousel, Image, Modal } from "antd";
import React, { useRef, useState } from "react";
import LinkButton from "../../../../component/Button/LinkButton";
import styles from "../../../../css/HandBillModal/ConfirmMediaUploadModal.module.css";
import { useCommentMediaUploadStore } from "../../../../stores/createCommentMediaFormStore";

interface ConfirmModalProps {
isVisible: boolean;
onClose: () => void;
uploadButton: React.ReactNode;
onConfirm: () => void; // Add onConfirm prop
}

const ConfirmMediaUploadModal: React.FC<ConfirmModalProps> = ({
isVisible,
onClose,
uploadButton,
onConfirm, // Destructure onConfirm
}) => {
const confirmCarouselRef = useRef<any>(null);
const [currentPreviewImageIndex, setCurrentPreviewImageIndex] = useState(0);
const {commentMediaPreview} = useCommentMediaUploadStore();

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
        {commentMediaPreview.length > 0 && (
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
                swipe
                draggable
            >
                {commentMediaPreview.map((file, index) => (
                <div key={index} className={styles.carouselItem}>
                    {file.type === "video" ? (
                    <video
                        autoPlay   // Make it autoplay
                        muted      // Required by most browsers for autoplay
                        controls   // Optional — if you still want visible controls
                        loop         // Optional, if you want it to repeat
                        src={file.url}
                        className={styles.reviewImg}


                    />
                    ) : (
                    <Image
                        height= "50vh"
                        width= "100%"
                        style={{ objectFit: 'contain' }}
                        src={file.url}
                        alt={`Media ${index}`}
                    />
                    )}
                </div>
                ))}
            </Carousel>
            {currentPreviewImageIndex < commentMediaPreview.length - 1 && (
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