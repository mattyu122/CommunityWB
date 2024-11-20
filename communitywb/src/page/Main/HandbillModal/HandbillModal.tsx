// HandbillModal.tsx

import { Empty, Modal, Tabs } from 'antd';
import React, { useCallback, useRef } from 'react';
import { HandBill } from '../../../models/HandBill';

import { Text } from '../../../component/Text/defaultText';
import { useBrowsedHandbillsStore } from '../../../stores/browsedHandBillStore';
import CommentInput from './CommentInput';
import CommentsSection, { CommentsSectionHandle } from './CommentsSection';
import MapSection from './MapSection';
import MediaCarousel from './MediaCarousel';
const { TabPane } = Tabs;

interface HandbillModalProps {
closeModal: () => void;
selectedHandBill: HandBill | null;
}

const HandbillModal: React.FC<HandbillModalProps> = ({
closeModal,
selectedHandBill,
}) => {
console.log('HandbillModal rendered');
const commentsSectionRef = useRef<CommentsSectionHandle>(null);
const { addBrowsedHandbill } = useBrowsedHandbillsStore();

const handleCommentAdded = useCallback(() => {
    // You can refresh comments or perform other actions here
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

return (
    <Modal
        open={true}
        onCancel={handleModalClose}
        footer={null}
        width="100vw"
        style={{ top: 20 }}
    >
        {selectedHandBill && (
        <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Content" key="1">
            <div style={{ display: 'flex', height: '80vh' }}>
                <MediaCarousel mediaList={selectedHandBill.handbillMedia} />
                <div style={{flex: 2,display: 'flex',flexDirection: 'column',height: '100%',backgroundColor: '#fff',}}>
                    <CommentsSection ref={commentsSectionRef} selectedHandBill={selectedHandBill}/>
                    <CommentInput selectedHandBillId={selectedHandBill.id} onCommentAdded={handleCommentAdded}/>
                </div>
            </div>
            </TabPane>
            <TabPane tab="Important notes" key="2">
                <Empty description={<Text>No important notes</Text>} />
            </TabPane>
            <TabPane tab="Location" key="3">
                <MapSection selectedHandBill={selectedHandBill}/>
            </TabPane>
        </Tabs>
        )}
    </Modal>
);
};

export default React.memo(HandbillModal);