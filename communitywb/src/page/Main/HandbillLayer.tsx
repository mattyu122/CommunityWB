import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { Board } from '../../models/Board';
import { HandBill } from '../../models/HandBill';
import { processHandBills } from '../../utils/handbillProcessing';
import HandBillComponent from './HandbillComponent';

interface HandbillLayerProps {
    handBills: HandBill[];
    boardListRef: React.MutableRefObject<Board[]>;
}

const HandbillLayer: React.FC<HandbillLayerProps> = ({ handBills, boardListRef }) => {

    useEffect(() => {
        // Generate newBoardList based on the new handBills
        const newBoardList = processHandBills(boardListRef.current, handBills);
        boardListRef.current = newBoardList;
    }, [handBills]);

    const onHandBillClick = useCallback((handBill: HandBill) => {
        console.log('Handbill clicked:', handBill);
    }, []);
    return (
        <div>
            {boardListRef.current.map((board, boardIndex) => (
                <div
                    key={boardIndex}
                    className="photo-display"
                    style={{ width: board.maxWidth, height: board.maxHeight }}
                >
                    <AnimatePresence>
                        {board.handbills.map((handBill) => (
                            <motion.div
                                key={handBill.id}
                                initial={{ opacity: 0, x: handBill.positionX, y: handBill.positionY }}
                                animate={{ opacity: 1, x: handBill.positionX, y: handBill.positionY }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    width: `${handBill.width + 10}px`,
                                    height: `${handBill.height + 10}px`,
                                }}
                            >
                                <HandBillComponent
                                    handBill={handBill}
                                    onClickHandBillHandler={onHandBillClick}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default React.memo(HandbillLayer);