import { Card } from 'antd';
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
        <Card
            hoverable
            onClick={() => onClickHandBillHandler(handBill)}
            className={`${isBrowsed ? styles.browsedDiv : ''} ${styles.handbillCard}`}
            styles={{
                body: {
                    padding: 0,
                    overflow: 'hidden',
                },
                }}
            style={{ border: 'none', margin: 0 }} // Remove card border and margin
            
        >
            {handBill.handbillMedia.length > 0 && (
                handBill.handbillMedia[0].mediaType === 'video' ?
                (
                    <video
                        src={handBill.handbillMedia[0].mediaUrl}
                        autoPlay   // Make it autoplay
                        muted      // Required by most browsers for autoplay
                        controls   // Optional — if you still want visible controls
                        loop         // Optional, if you want it to repeat
                        className={styles.handbillimage}
                        style={{ width: handBill.width, height: handBill.height }}
                    />
                ):(
                    <img
                        src={handBill.handbillMedia[0].mediaUrl}
                        alt={`Caption: ${handBill.caption}`}
                        className={`${styles.handbillimage}`}
                        style={{ width: handBill.width, height: handBill.height }}
                />
                )
            )}
        </Card>
    );
};

export default React.memo(HandBillComponent);