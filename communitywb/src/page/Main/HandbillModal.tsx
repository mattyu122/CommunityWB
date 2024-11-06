import { UserOutlined } from "@ant-design/icons"; // Import the default user icon
import { List, Modal } from "antd";
import { useState } from "react";
import { HandBill } from "../../models/HandBill";

interface HandbillModalProps {
    isModalVisible: boolean;
    closeModal: () => void;
    selectedHandBill: HandBill | null;
}

const HandbillModal = ({ isModalVisible, closeModal, selectedHandBill }: HandbillModalProps) => {
    const [text, setText] = useState<string>('');
    // const [comments, setComments] = useState<string[]>([]);
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
                    {/* Left side - Media List */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {selectedHandBill.handbillMedia && selectedHandBill.handbillMedia.length > 0 ? (
                            <List
                                dataSource={selectedHandBill.handbillMedia}
                                renderItem={(media) => (
                                    <List.Item key={media.id}>
                                        {media.mediaType === "VIDEO" ? (
                                            <video
                                                src={media.mediaUrl}
                                                controls
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />
                                        ) : (
                                            <img
                                                src={media.mediaUrl}
                                                alt={`Media ${media.id}`}
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />
                                        )}
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <p>No media available</p>
                        )}
                    </div>

                    {/* Right side - Comment Section */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fff' }}>
                        {/* User info */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            {/* User Icon with fallback to UserOutlined */}
                            {selectedHandBill.user?.imageUrl ? (
                                <img 
                                    src={selectedHandBill.user.imageUrl} 
                                    alt={`${selectedHandBill.user.fullname}'s icon`} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} 
                                />
                            ) : (
                                <UserOutlined style={{ fontSize: '40px', marginRight: '10px' }} /> // AntD default user icon
                            )}
                            {/* User Fullname */}
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