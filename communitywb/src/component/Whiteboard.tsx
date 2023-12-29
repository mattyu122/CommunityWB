import { useEffect, useState } from 'react';
import Board from '../DataModel/Board';
import HandBill from '../DataModel/Handbill';
import WhiteBoard from '../DataModel/WhiteBoard';
import '../css/Whiteboard.css';
import HandBillComponent from './Handbill';
interface whiteboardProps{
    whiteBoard: WhiteBoard;
}

const WhiteboardComponent = ({whiteBoard}:whiteboardProps) => {
    // const [HandBillsFromDB, setDisplayHandBill] = useState<HandBill[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [boardList, setBoardList] = useState<Board[]>([]);

    const goToNextBoard = () => {
        setCurrentPage(current => Math.min(current+1, boardList.length-1));
    }

    const goToPreviousBoard = () => {
        setCurrentPage(current => Math.max(current-1, 0));
    }
    const getAllHandBills = () => {
        fetch('http://localhost:3000/whiteboard',{
        method: 'GET'
        })
        .then(response => 
        {
        if (response.ok) {
            return response.json()
        }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // setDisplayHandBill(data)
            whiteBoard.addHandBillToBoards(data);
        })
        .then(() => {
            setBoardList(whiteBoard.boardList);
            // setDisplayHandBill(whiteBoard.boardList[0].handbills);
            console.log(boardList);
        })
    }

    const onHandBillClick = (handBill: HandBill)=> {
        console.log(handBill);
        console.log(boardList)
    }

    useEffect(() => {
        getAllHandBills();
        console.log(boardList);
    },[])

    return (
    <div className="whiteboard" style={{width: whiteBoard.maxWidth, height:whiteBoard.maxHeight}}>
        <div className="photo-display">
            {boardList[currentPage] && boardList[currentPage].handbills.map((handBill, index) => (
                <div key={handBill.id || index} 
                style={{position: 'absolute', 
                left: `${handBill.positionX}px`,
                top:`${handBill.positionY}px`, 
                width: `${handBill.width}px`,   // Ensure width and height are set so they don't stack
                height: `${handBill.height}px`,}}>
                    <HandBillComponent key={index} handBill={handBill} onClickHandBillHandler={onHandBillClick} />
                </div>
            ))}
        </div>
        <div>
            <button onClick={goToPreviousBoard} disabled={currentPage === 0}>Previous Board</button>
            <button onClick={goToNextBoard} disabled={currentPage === boardList.length - 1}>Next Board</button>
        </div>
    </div>
    );
}

export default WhiteboardComponent;