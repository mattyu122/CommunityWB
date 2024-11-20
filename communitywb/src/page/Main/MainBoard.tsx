import { Divider, Spin } from 'antd';
import { LatLng } from 'leaflet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHandbillPagesQuery } from '../../api/handbill/handBillQuery';
import styles from '../../css/MainBoard.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { Board } from '../../models/Board';
import { useLocationStore } from '../../stores/locationStore';
import { processHandBills } from '../../utils/handbillProcessing';
import HandbillLayer from './HandbillLayer';
import LocationMap from './LocationMap';

const MainBoard = () => {
    const [page, setPage] = useState(0);
    const boardListRef = useRef<Board[]>([]);
    const [hoveredHandBillId, setHoveredHandBillId] = useState<number | null>(null);

    const { getCurrentLocation } = useCurrentLocation();
    const { location, radius, setLocation } = useLocationStore();
    const { data, isPending } = useHandbillPagesQuery({
        location: location ?? new LatLng(0, 0),
        radius,
        page,
        enabled: location !== null,
    });

    const fetchCurrentLocation = async () => {
        const loc = await getCurrentLocation();
        if(loc && (loc.lat !== location?.lat || loc.lng !== location?.lng)){
            setLocation(loc);

        }
    };

    useEffect(() => {
        setPage(0);
        boardListRef.current = [];
        console.log('Page', page);
    }, [location, radius]);

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (data) {
            fetchNextPageWithDelay();
        }
    }, [data]);

    const fetchNextPageWithDelay = async () => {
        if (data && page < data.totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        const container = document.querySelector(`.${styles.handbillContainer}`);
        if (container && data && data.handBills && data.handBills.length > 0) {
            const newBoardList = processHandBills(
                boardListRef.current,
                data.handBills,
                container.clientWidth,
                container.clientHeight
            );
            boardListRef.current = newBoardList;
        }
    }, [data]);

    const onHandBillHover = useCallback((handBillId: number | null) => {
        setHoveredHandBillId(handBillId);
    }, []);

    return (
        <div className={styles.mainContainer}>
            {isPending ? (
                <div className={styles.loadingContainer}>
                    <Spin tip="Loading more handbills..." />
                </div>
            ) : (
                <div className={styles.whiteboard}>
                    <div className={styles.locationMapContainer}>
                        <LocationMap boardListRef={boardListRef} hoveredHandBillId={hoveredHandBillId}/>

                    </div>
                    <Divider type="vertical" style={{height: '100%'}} />
                    <div className={styles.handbillContainer}>
                        <HandbillLayer
                            boardList={boardListRef.current}
                            onHandBillHover={onHandBillHover}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(MainBoard);