import styles from '../../css/HandBill.module.css';
import { HandBill } from '../../models/HandBill';

interface HandBillProps {
    handBill: HandBill;
    onClickHandBillHandler: (handBill: HandBill) => void;
}

const HandBillComponent = ({ handBill, onClickHandBillHandler }: HandBillProps) => {

    return (
        <div onClick={() => onClickHandBillHandler(handBill)}>
            {
                handBill.handbillMedia.length > 0 &&
                <img
                    src={handBill.handbillMedia[0].mediaUrl}
                    alt={`Caption: ${handBill.caption}`}
                    className={styles.handbillimage}
                    style={{ width: handBill.width, height: handBill.height }}
                />
            }

        </div>
    );
};

export default HandBillComponent;