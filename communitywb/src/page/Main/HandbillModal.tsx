import { Input, Modal } from "antd";
import { useState } from "react";
import { HandBill } from "../../models/HandBill";

interface HandbillModalProps {
    isModalVisible: boolean;
    closeModal: () => void;
    selectedHandBill: HandBill | null;
}

const HandbillModal = ({ isModalVisible, closeModal, selectedHandBill }: HandbillModalProps) => {
    const [text, setText] = useState<string>('');

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
                    {/* Left side - Picture/Video */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        {/* Example for displaying image or video */}
                        {selectedHandBill.imageUrl ? (
                            <img 
                                src={selectedHandBill.imageUrl} 
                                alt={selectedHandBill.caption} 
                                style={{ maxWidth: '100%', maxHeight: '100%' }} 
                            />
                        ): null}
                    </div>

                    {/* Right side - Comment Section */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fff' }}>
                        <h2>{selectedHandBill.caption}</h2>
                        <div style={{ marginBottom: '20px' }}>
                            <Input
                                placeholder="Enter text to stick on canvas"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        {/* Comment Section */}
                        <div>
                            <h3>Comments</h3>
                            {/* Example comments */}
                            <div style={{ marginBottom: '10px' }}>
                                <p><strong>User1:</strong> Amazing handbill!</p>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <p><strong>User2:</strong> I love the design!</p>
                            </div>
                            {/* Add more comments as needed */}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}

export default HandbillModal;