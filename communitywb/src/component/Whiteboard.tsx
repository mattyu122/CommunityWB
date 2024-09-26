/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Board from '../DataModel/Board';
import HandBill from '../DataModel/HandBill/Handbill';
import WhiteBoard from '../DataModel/WhiteBoard';
import { useHandbillPagesQuery } from '../api/handbill/handBillQuery';
import '../css/Whiteboard.css';
import HandBillComponent from './Handbill';
interface whiteboardProps{
    whiteBoard: WhiteBoard;
}

const WhiteboardComponent = ({whiteBoard}:whiteboardProps) => {
    const [boardList] = useState<Board[]>(whiteBoard.boardList);
    const [page, setPage] = useState(0);
    const [size] = useState(6); // Adjust the size as needed

    const { data } = useHandbillPagesQuery(page, size);

    useEffect(()=>{
        const fetchNextPageWithDelay = async () => {
            if (data && page < data.totalPages) {
                console.log('fetching next page');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay by 1 second
                setPage(prevPage => prevPage + 1);
                console.log('finished waiting');
            }
        };
        if (data){
            console.log(page, data.totalPages);
            whiteBoard.addHandBillToBoards(data.handBills);
        }

        fetchNextPageWithDelay();
    }, [data])



    const onHandBillClick = (handBill: HandBill)=> {
        console.log(handBill);
    }
    return (
        <div className="whiteboard">
            {boardList.map((board, boardIndex) => (
                <div key={boardIndex} className="photo-display" style={{width: board.maxWidth, height: board.maxHeight}}>
                    {board.handbills.map((handBill, index) => (
                        <div key={handBill.id || index}
                            style={{
                                position: 'absolute',
                                left: `${handBill.positionX}px`,
                                top: `${handBill.positionY}px`,
                                width: `${handBill.width + 10}px`,
                                height: `${handBill.height + 10}px`,
                            }}>
                            <HandBillComponent key={index} handBill={handBill} onClickHandBillHandler={onHandBillClick} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default WhiteboardComponent;