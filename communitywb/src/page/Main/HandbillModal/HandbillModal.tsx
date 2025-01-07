// HandbillModal.tsx

import { Empty, Modal, Tabs } from 'antd';
import React, { useCallback, useRef } from 'react';
import { HandBill } from '../../../models/HandBill';

import { Text } from '../../../component/Text/defaultText';
import { useBrowsedHandbillsStore } from '../../../stores/browsedHandBillStore';
import CommentInput from './ContentTab/CommentInput';
import CommentsSection, { CommentsSectionHandle } from './ContentTab/CommentsSection';
import MediaCarousel from './ContentTab/MediaCarousel';
import MapSection from './LocationTab/MapSection';
import ImportantNotes from './PinnedNotesTab/PinnedNotes';
import ShareSection from './ShareTab/ShareSection';

interface HandbillModalProps {
    closeModal: () => void;
    selectedHandBill: HandBill | null;
}

const HandbillModal: React.FC<HandbillModalProps> = ({ closeModal, selectedHandBill }) => {
    const commentsSectionRef = useRef<CommentsSectionHandle>(null);
    const { addBrowsedHandbill } = useBrowsedHandbillsStore();

    const handleCommentAdded = useCallback(() => {
        console.log('Comment added');
    }, []);

    const handleModalClose = useCallback(() => {
        const currentPage = commentsSectionRef.current?.getCurrentPage() || 0;
        const scrollPosition = commentsSectionRef.current?.getScrollPosition() || 0;

        if (selectedHandBill) {
            addBrowsedHandbill(selectedHandBill.id, currentPage, scrollPosition);
        }

        closeModal();
    }, [addBrowsedHandbill, closeModal, selectedHandBill]);

    const tabItems = [
        {
            label: 'Content',
            key: '1',
            children: (
                <div style={{ display: 'flex', height: '80vh' }}>
                    <MediaCarousel mediaList={selectedHandBill?.handbillMedia || []} />
                    <div
                        style={{
                            flex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            backgroundColor: '#fff',
                        }}
                    >
                        {   selectedHandBill ?
                            <CommentsSection
                                ref={commentsSectionRef}
                                selectedHandBill={selectedHandBill}
                            /> :
                            <Empty description={<Text>No comments</Text>} />
                        }
                            <CommentInput
                                selectedHandBillId={selectedHandBill?.id || 0}
                                onCommentAdded={handleCommentAdded}
                            />
                    </div>
                </div>
            ),
        },
        {
            label: 'Pinned',
            key: '2',
            children: selectedHandBill ?
                        <ImportantNotes selectedHandBill={selectedHandBill} /> :
                        <Empty description={<Text>No Pinned Notes</Text>} />,
        },
        {
            label: 'Location',
            key: '3',
            children: selectedHandBill ?
                        <MapSection selectedHandBill={selectedHandBill} /> :
                        <Empty description={<Text>No location available</Text>} />,
        },
        {
            label: 'Share',
            key: '4',
            children: selectedHandBill ? <ShareSection selectedHandBill={selectedHandBill} /> : <Empty description={<Text>No handbill selected</Text>} />,
        }
    ];

    return (
        <Modal
            open={true}
            onCancel={handleModalClose}
            footer={null}
            width="100vw"
            style={{ top: 20 }}
        >
            {selectedHandBill && (
                <Tabs defaultActiveKey="1" type="card" items={tabItems} />
            )}
        </Modal>
    );
};

export default React.memo(HandbillModal);
