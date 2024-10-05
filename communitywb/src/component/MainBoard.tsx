import { Spin } from 'antd';
import { LatLng } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useHandbillPagesQuery } from '../api/handbill/handBillQuery';
import '../css/Whiteboard.css';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { Board } from '../models/Board';
import { HandBill } from '../models/HandBill';
import { useLocationStore } from '../stores/locationStore';
import { processHandBills } from '../utils/handbillProcessing';
import HandBillComponent from './Handbill';

const MainBoardComponent = () => {
    const [boardList, setBoardList] = useState<Board[]>([]);
    const [page, setPage] = useState(0);

    const { getCurrentLocation } = useCurrentLocation();
    const { location, radius, setLocation } = useLocationStore();

    const { data, isPending } = useHandbillPagesQuery({
        location: location ?? new LatLng(0, 0),
        radius,
        page,
        enabled: location !== null,
    });

    const fetchCurrentLocation = async () => {
        console.log('Fetching current location');
        const loc = await getCurrentLocation();
        console.log('Done fetching current location');

        setLocation(loc);
    };

    const fetchNextPageWithDelay = async () => {
        if (data && page < data.totalPages) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay by 1 second
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        // Clear the board list when location or radius changes
        setBoardList([]);
        setPage(0);
    }, [location, radius]);

    // Fetch user's current location on component mount
    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (data) {
            setBoardList(prevBoardList => processHandBills(prevBoardList, data.handBills));
            fetchNextPageWithDelay();
        }
    }, [data]);

    const onHandBillClick = useCallback((handBill: HandBill) => {
        console.log('Handbill clicked:', handBill);
    }, []);

    return (
        <div className="main-container">
            {isPending ? (
                <div className="loading-container">
                    <Spin tip="Loading more handbills..." />
                </div>
            ) : (
                <div className="whiteboard">
                    {boardList.map((board, boardIndex) => (
                        <div
                            key={boardIndex}
                            className="photo-display"
                            style={{ width: board.maxWidth, height: board.maxHeight }}
                        >
                            {board.handbills.map((handBill, index) => (
                                <div
                                    key={handBill.id}
                                    style={{
                                        position: 'absolute',
                                        left: `${handBill.positionX}px`,
                                        top: `${handBill.positionY}px`,
                                        width: `${handBill.width + 10}px`,
                                        height: `${handBill.height + 10}px`,
                                    }}
                                >
                                    <HandBillComponent handBill={handBill} onClickHandBillHandler={onHandBillClick} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainBoardComponent;