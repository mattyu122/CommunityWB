/* eslint-disable react-hooks/exhaustive-deps */
import { Spin } from 'antd';
import { LatLng } from 'leaflet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import HandBill from '../DataModel/HandBill/Handbill';
import WhiteBoard from '../DataModel/WhiteBoard';
import { useHandbillPagesQuery } from '../api/handbill/handBillQuery';
import '../css/Whiteboard.css';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import HandBillComponent from './Handbill';

interface MainboardProps {
    whiteBoard: WhiteBoard;
    location: LatLng | null;
    setLocation: (location: LatLng) => void;
    radius: number;
}
const MainBoardComponent = ({whiteBoard,location, setLocation,radius}: MainboardProps) => {
    const boardList = useMemo(() => whiteBoard.boardList, [whiteBoard.boardList]);
    const [page, setPage] = useState(0);
    const { getCurrentLocation } = useCurrentLocation();
    const { data, isPending } = useHandbillPagesQuery({
        lat: location?.lat || 0,
        lng: location?.lng || 0,
        radius,
        page,
        enabled: location !== null
    });

    const fetchCurrentLocation = async () => {
        const loc = await getCurrentLocation();
        setLocation(loc);
    }

    const fetchNextPageWithDelay = async () => {
        if (data && page < data.totalPages) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay by 1 second
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(()=>{
        console.log('Location changed', location);
        whiteBoard.clearBoards();
        setPage(0);
    },[location, radius])

    // Fetch user's current location and set it
    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    useEffect(()=>{
        if (data){
            console.log(data.handBills);
            whiteBoard.addHandBillToBoards(data.handBills);
            fetchNextPageWithDelay();
        }
    }, [data])

    const onHandBillClick = useCallback((handBill: HandBill) => {
        console.log(handBill);
    }, []);

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

            {isPending && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <Spin tip="Loading more handbills..." />
                </div>
            )}
        </div>
    );
}

export default MainBoardComponent;