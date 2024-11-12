import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import styles from '../../css/HandBillLayer.module.css';
import { Board } from '../../models/Board';
import { HandBill } from '../../models/HandBill';
import { useBrowsedHandbillsStore } from '../../stores/browsedHandBillStore';
import HandBillComponent from './HandbillComponent';
import HandbillModal from './HandbillModal';

interface HandbillLayerProps {
    boardList: Board[]; // Directly passed from MainBoard
    onHandBillHover: (handBillId: number | null) => void;
}

const HandbillLayer: React.FC<HandbillLayerProps> = ({ boardList, onHandBillHover }) => {
    boardList.forEach((board) => {
        board.handbills.forEach((handBill) => {
            console.log("id type", typeof(handBill.id));
        });
    })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedHandBill, setSelectedHandBill] = useState<HandBill | null>(null);

    const {browsedHandbills, addBrowsedHandbill} = useBrowsedHandbillsStore();

    const onHandBillClickHandle = useCallback((handBill: HandBill) => {
        console.log("Handbill clicked", handBill);
        setSelectedHandBill(handBill);
        setIsModalVisible(true);
        addBrowsedHandbill(handBill.id);
    }, [addBrowsedHandbill]);

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedHandBill(null);
    };


    return (
        <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
            {boardList.map((board, boardIndex) => (
                <div
                    key={boardIndex}
                    className={styles.photoDisplay}
                    style={{ width: board.maxWidth, height: board.maxHeight }}
                >
                    <AnimatePresence>
                        {board.handbills.map((handBill) => {
                            const isBrowsed = browsedHandbills.some((entry) => entry.id === handBill.id);
                            
                            return (
                                <motion.div
                                    key={handBill.id}
                                    initial={{ opacity: 0, x: handBill.positionX, y: handBill.positionY }}
                                    animate={{ opacity: 1, x: handBill.positionX, y: handBill.positionY }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        width: `${handBill.width}px`,
                                        height: `${handBill.height}px`,
                                    }}
                                    onMouseEnter={() => onHandBillHover(handBill.id)}
                                    onMouseLeave={() => onHandBillHover(null)}
                                >
                                    <HandBillComponent
                                        handBill={handBill}
                                        onClickHandBillHandler={onHandBillClickHandle}
                                        isBrowsed = {isBrowsed}
                                    />
                                </motion.div>
                            )}
                        )}
                    </AnimatePresence>
                </div>
            ))}
            {/* Modal for displaying handbill details and canvas */}
            <HandbillModal
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                selectedHandBill={selectedHandBill}/>
        </div>
    );
};

export default React.memo(HandbillLayer);