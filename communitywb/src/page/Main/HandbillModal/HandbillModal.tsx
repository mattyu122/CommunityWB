import { Empty, Modal, Tabs } from 'antd';
import React, { useCallback, useRef } from 'react';
import { Text } from '../../../component/Text/defaultText';
import { HandBill } from '../../../models/HandBill';
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

    const handleModalClose = useCallback(() => {
        const currentPage = commentsSectionRef.current?.getCurrentPage() || 0;
        const scrollPosition = commentsSectionRef.current?.getScrollPosition() || 0;

        if (selectedHandBill) {
            addBrowsedHandbill(selectedHandBill.id, currentPage, scrollPosition);
        }

        closeModal();
    }, [addBrowsedHandbill, closeModal, selectedHandBill]);

    const renderContentTab = () => (
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
                {selectedHandBill ? (
                    <>
                        <CommentsSection
                            ref={commentsSectionRef}
                            selectedHandBill={selectedHandBill}
                        />
                        <CommentInput selectedHandBill={selectedHandBill} />
                    </>
                ) : (
                    <Empty description={<Text>No handbill selected</Text>} />
                )}
            </div>
        </div>
    );
    

    const renderPinnedTab = () =>
        selectedHandBill ? (
            <ImportantNotes selectedHandBill={selectedHandBill} />
        ) : (
            <Empty description={<Text>No Pinned Notes</Text>} />
        );

    const renderLocationTab = () =>
        selectedHandBill ? (
            <MapSection selectedHandBill={selectedHandBill} />
        ) : (
            <Empty description={<Text>No location available</Text>} />
        );

    const renderShareTab = () =>
        selectedHandBill ? (
            <ShareSection selectedHandBill={selectedHandBill} />
        ) : (
            <Empty description={<Text>No handbill selected</Text>} />
        );

    const tabItems = [
        { label: 'Content', key: '1', children: renderContentTab() },
        { label: 'Pinned', key: '2', children: renderPinnedTab() },
        { label: 'Location', key: '3', children: renderLocationTab() },
        { label: 'Share', key: '4', children: renderShareTab() },
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
