import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import styles from '../../css/HandBillLayer.module.css';
import { Board } from '../../models/Board';
import { HandBill } from '../../models/HandBill';
import { processHandBills } from '../../utils/handbillProcessing';
import HandBillComponent from './HandbillComponent';
interface HandbillLayerProps {
    handBills: HandBill[];
    boardListRef: React.MutableRefObject<Board[]>;
}

const HandbillLayer: React.FC<HandbillLayerProps> = ({ handBills, boardListRef }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
    // Generate newBoardList based on the new handBills
    if (containerRef.current) {
        console.log('containerRef.current', containerRef.current.clientWidth, containerRef.current.clientHeight);
        const newBoardList = processHandBills(
            boardListRef.current,
            handBills,
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
        );
        boardListRef.current = newBoardList;
    }
    }, [handBills]);

    const onHandBillClick = useCallback((handBill: HandBill) => {
        console.log('Handbill clicked:', handBill);
    }, []);
    return (
        <div ref={containerRef} style={{ height: '100%', width: '100%', overflow: 'auto' }}>
            {boardListRef.current.map((board, boardIndex) => (
                <div
                    key={boardIndex}
                    className={styles.photoDisplay}
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