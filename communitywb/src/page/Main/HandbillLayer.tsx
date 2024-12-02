import React, { useCallback, useState } from 'react';
import styles from '../../css/HandBillLayer.module.css';
import { Board } from '../../models/Board';
import { HandBill } from '../../models/HandBill';
import { useBrowsedHandbillsStore } from '../../stores/browsedHandBillStore';
import HandBillComponent from './HandbillComponent';
import HandbillModal from './HandbillModal/HandbillModal';

interface HandbillLayerProps {
    boardList: Board[];
    onHandBillHover: (handBillId: number | null) => void;
}

const HandbillLayer: React.FC<HandbillLayerProps> = ({ boardList, onHandBillHover }) => {
    const [selectedHandBill, setSelectedHandBill] = useState<HandBill | null>(null);

    const { browsedHandbills } = useBrowsedHandbillsStore();
    const onHandBillClickHandle = useCallback(
        (handBill: HandBill) => {
            setSelectedHandBill(handBill);
        },
    []
    );

    const closeModal = () => {
        setSelectedHandBill(null);
    };

    return (
        <div>
            {boardList.map((board, boardIndex) => (
            <div
                key={boardIndex}
                className={styles.photoDisplay}
                style={{ width: board.maxWidth, height: board.maxHeight }}
            >
                {board.handbills.map((handBill) => {
                    const isBrowsed = browsedHandbills.some((entry) => entry.id === handBill.id);

                    return (
                        <div
                        key={handBill.id}
                        style={{
                            position: 'absolute',
                            width: `${handBill.width}px`,
                            height: `${handBill.height}px`,
                            left: `${handBill.positionX}px`,
                            top: `${handBill.positionY}px`,
                        }}
                        onMouseEnter={() => onHandBillHover(handBill.id)}
                        onMouseLeave={() => onHandBillHover(null)}
                        >
                            <HandBillComponent
                                handBill={handBill}
                                onClickHandBillHandler={onHandBillClickHandle}
                                isBrowsed={isBrowsed}
                            />
                        </div>
                    );
                    })}
            </div>
            ))}

            {/* Conditionally render HandbillModal */}
            {selectedHandBill && (
                <HandbillModal
                    closeModal={closeModal}
                    selectedHandBill={selectedHandBill}
                />
            )}
        </div>
    );
};

export default React.memo(HandbillLayer);