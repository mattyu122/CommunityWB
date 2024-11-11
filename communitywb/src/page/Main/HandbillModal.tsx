import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { Carousel, Modal } from "antd";
import { useRef, useState } from "react";
import LinkButton from "../../component/Button/LinkButton";
import styles from "../../css/HandbillModal.module.css";
import { HandBill } from "../../models/HandBill";

interface HandbillModalProps {
    isModalVisible: boolean;
    closeModal: () => void;
    selectedHandBill: HandBill | null;
}

const HandbillModal = ({ isModalVisible, closeModal, selectedHandBill }: HandbillModalProps) => {
    const carouselRef = useRef<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleAfterChange = (index: number) => {
        setCurrentIndex(index);
    };

    const goToNext = () => {
        carouselRef.current?.next();
    };

    const goToPrevious = () => {
        carouselRef.current?.prev();
    };

    const mediaLength = selectedHandBill?.handbillMedia.length || 0;

    return (
        <Modal
            open={isModalVisible}
            onCancel={closeModal}
            footer={null}
            width="100vw"
            style={{
                top: 20,
                height: '100vh',
                padding: 0,
            }}
        >
            {selectedHandBill && (
                <div style={{ display: 'flex', height: '100%' }}>
                    {/* Left side - Carousel for swipeable media */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {mediaLength > 0 ? (
                            <div className={styles.carouselContainer}>
                                {/* Left Arrow Button */}
                                {currentIndex > 0 && (
                                    <LinkButton
                                        className={`${styles.arrow} ${styles.leftArrow}`}
                                        icon={<LeftOutlined />}
                                        onClick={goToPrevious}
                                    />
                                )}

                                {/* Carousel */}
                                <Carousel ref={carouselRef} infinite={false} afterChange={handleAfterChange}>
                                    {selectedHandBill.handbillMedia.map((media, index) => (
                                        <div key={index} className={styles.carouselItem}>
                                            {media.mediaType === 'VIDEO' ? (
                                                <video
                                                    src={media.mediaUrl}
                                                    controls
                                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                />
                                            ) : (
                                                <img
                                                    className={styles.img}
                                                    src={media.mediaUrl}
                                                    alt={`Media ${index}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </Carousel>

                                {/* Right Arrow Button */}
                                {currentIndex < mediaLength - 1 && (
                                    <LinkButton
                                        className={`${styles.arrow} ${styles.rightArrow}`}
                                        icon={<RightOutlined />}
                                        onClick={goToNext}
                                    />
                                )}
                            </div>
                        ) : (
                            <p>No media available</p>
                        )}
                    </div>

                    {/* Right side - Comment Section */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fff' }}>
                        {/* User info */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            {selectedHandBill.user?.imageUrl ? (
                                <img
                                    src={selectedHandBill.user.imageUrl}
                                    alt={`${selectedHandBill.user.fullname}'s icon`}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: '40px', marginRight: '10px' }} />
                            )}
                            <h3 style={{ margin: 0 }}>{selectedHandBill.user?.fullname || "Unknown User"}</h3>
                        </div>

                        {/* Handbill caption */}
                        <div>
                            <h2>{selectedHandBill.caption}</h2>
                        </div>

                        {/* Comment Section */}
                        <div>
                            <h3>Comments</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <p><strong>User1:</strong> Amazing handbill!</p>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <p><strong>User2:</strong> I love the design!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default HandbillModal;