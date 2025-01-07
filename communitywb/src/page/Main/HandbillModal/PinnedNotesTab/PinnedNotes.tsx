import { HandBill } from "../../../../models/HandBill";

interface ImportantNotesProps {
    selectedHandBill: HandBill;
}
const ImportantNotes: React.FC<ImportantNotesProps> = ({selectedHandBill}) => {
    return (
        <div>
            <h3>Important Notes</h3>
        </div>
    )
};

export default ImportantNotes;