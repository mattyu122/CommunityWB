import HandBill from "../DataModel/HandBill/Handbill";

interface HandBillProps{
    handBill: HandBill;
    onClickHandBillHandler: (handBill: HandBill) => void;
}
const HandBillComponent = ({handBill, onClickHandBillHandler}:HandBillProps) => {
    return (
        <div onClick={() => onClickHandBillHandler(handBill)}>
            <img src={handBill.imageUrl} alt={`Caption: ${handBill.caption}`} style={{width:handBill.width, height:handBill.height,objectFit:'cover'}}/>
        </div>
    )
};

export default HandBillComponent;