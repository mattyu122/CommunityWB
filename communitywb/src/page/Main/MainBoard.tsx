import { Divider, Spin } from 'antd';
import { LatLng } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { useHandbillPagesQuery } from '../../api/handbill/handBillQuery';
import styles from '../../css/MainBoard.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { Board } from '../../models/Board';
import { useLocationStore } from '../../stores/locationStore';
import HandbillLayer from './HandbillLayer';
import LocationMap from './LocationMap';

const MainBoard = () => {
    const [page, setPage] = useState(-1);
    const boardListRef = useRef<Board[]>([]);

    const { getCurrentLocation } = useCurrentLocation();
    const { location, radius, setLocation } = useLocationStore();

    const { data, isPending } = useHandbillPagesQuery({
        location: location ?? new LatLng(0, 0),
        radius,
        page,
        enabled: location !== null && page !== -1,
    });

    const fetchCurrentLocation = async () => {
        const loc = await getCurrentLocation();
        if (loc.lat !== location?.lat || loc.lng !== location?.lng) {
            setLocation(loc);
        }
    };

    useEffect(() => {
        console.log('location or radius changed', location, radius);
        if (page !== 0) {
            setPage(0);
        }
        boardListRef.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, radius]);

    useEffect(() => {
        console.log('fetching current location');
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (data) {
            fetchNextPageWithDelay();
        }
    }, [data]);

    useEffect(() => {
        return () => {
            console.log('unmounting');
        }
    }, []);

    const fetchNextPageWithDelay = async () => {
        if (data && page < data.totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setPage((prevPage) => prevPage + 1);
        }
    };


    return (
        <div className={styles.mainContainer}>
            {isPending ? (
                <div className={styles.loadingContainer}>
                    <Spin tip="Loading more handbills..." />
                </div>
            ) : (
                <div className={styles.whiteboard}>
                    <div className={styles.locationMapContainer}>
                        <LocationMap />
                    </div>
                    <Divider type="vertical" style={{height: '100%'}} />
                    <div className={styles.handbillContainer}>
                        <HandbillLayer
                            handBills={data ? data.handBills : []}
                            boardListRef={boardListRef}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(MainBoard);