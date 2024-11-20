import React from 'react';
import styles from '../../css/HandBillComponent.module.css';
import { HandBill } from '../../models/HandBill';

interface HandBillProps {
    handBill: HandBill;
    onClickHandBillHandler: (handBill: HandBill) => void;
    isBrowsed: boolean;
}

const HandBillComponent = ({ handBill, onClickHandBillHandler, isBrowsed }: HandBillProps) => {
    return (
        <div onClick={() => onClickHandBillHandler(handBill)} className={`${isBrowsed ? styles.browsedDiv: ''}`}>
            {
                handBill.handbillMedia.length > 0 &&
                <img
                    src={handBill.handbillMedia[0].mediaUrl}
                    alt={`Caption: ${handBill.caption}`}
                    className={`${styles.handbillimage}`}
                    style={{ width: handBill.width, height: handBill.height }}
                />
            }

        </div>
    );
};

export default React.memo(HandBillComponent);