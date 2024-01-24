import axios from 'axios';
import { useEffect, useState } from 'react';
import Board from '../DataModel/Board';
import HandBill from '../DataModel/HandBill/Handbill';
import HandBillPage from '../DataModel/HandBill/page/HandBillPages';
import WhiteBoard from '../DataModel/WhiteBoard';
import '../css/Whiteboard.css';
import HandBillComponent from './Handbill';
interface whiteboardProps{
    whiteBoard: WhiteBoard;
}

const WhiteboardComponent = ({whiteBoard}:whiteboardProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [boardList, setBoardList] = useState<Board[]>([]);
    const [pageData, setPageData] = useState(new HandBillPage())
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(15); // Adjust the size as needed

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
            whiteBoard.addHandBillToBoards(data);
        })
        .then(() => {
            setBoardList(whiteBoard.boardList);
            console.log(boardList);
        })
    }

    const fetchHandBillPages = async () => {
        try {
        const response = await axios.get('http://localhost:3000/whiteboard/handbillpage', {
            params: { page, size },
        });
        console.log(response);
        whiteBoard.addHandBillToBoards(response.data.handBills);

        setPageData({
            handBills: response.data.handBills,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            currentPage: response.data.currentPage,
        });
        } catch (error) {
        console.error('Error fetching handbills:', error);
        }
    };

    const onHandBillClick = (handBill: HandBill)=> {
        console.log(handBill);
        console.log(boardList)
    }

    useEffect(() => {
        // getAllHandBills();
        fetchHandBillPages();
        console.log(boardList);
    },[page,size])

    return (
    <div className="whiteboard" style={{width: whiteBoard.maxWidth, height:whiteBoard.maxHeight}}>
        <div className="photo-display">
            {pageData.handBills.map((handBill, index) => (
                <div key={handBill.id || index}
                style={{position: 'absolute',
                left: `${handBill.positionX}px`,
                top:`${handBill.positionY}px`,
                width: `${handBill.width+10}px`,   // Ensure width and height are set so they don't stack
                height: `${handBill.height+10}px`,}}>
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