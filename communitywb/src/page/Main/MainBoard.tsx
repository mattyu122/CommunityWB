import { useQueryClient } from '@tanstack/react-query';
import { Divider, Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHandbillPagesInfiniteQuery } from '../../api/handbill/handBillQuery';
import styles from '../../css/MainBoard.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { Board } from '../../models/Board';
import { useLocationStore } from '../../stores/locationStore';
import { processHandBills } from '../../utils/handbillProcessing';
import HandbillLayer from './HandbillLayer';
import LocationMap from './LocationMap';

const MainBoard = () => {
    const [boardList, setBoardList] = useState<Board[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the container
    const [hoveredHandBillId, setHoveredHandBillId] = useState<number | null>(null);
    const processedIdsRef = useRef(new Set());

    const { getCurrentLocation } = useCurrentLocation();
    const { location, radius, setLocation } = useLocationStore();

    const isLocationValid = location && !isNaN(location.lat) && !isNaN(location.lng);

    // Store the previous location and radius
    const prevLocationRef = useRef(location);
    const prevRadiusRef = useRef(radius);
    const queryClient = useQueryClient();
    const {
        data,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useHandbillPagesInfiniteQuery({
        location,
        radius,
        enabled: isLocationValid,
    });

    useEffect(() => {
        const fetchCurrentLocation = async () => {
            const loc = await getCurrentLocation();
            if (loc && (loc.lat !== location?.lat || loc.lng !== location?.lng)) {
                setLocation(loc);
                refetch();
            }
        };
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if ( isLocationValid &&
            (   prevLocationRef.current?.lat !== location?.lat ||
                prevLocationRef.current?.lng !== location?.lng ||
                prevRadiusRef.current !== radius
            )
        ) {
            processedIdsRef.current.clear();
            setBoardList([]);
            queryClient.removeQueries({ queryKey: ['handbillPages'] });
            prevLocationRef.current = location;
            prevRadiusRef.current = radius;
        }
    }, [location,radius]);

    useEffect(() => {
        if (data) {
            const latestPage = data.pages[data.pages.length - 1];
            const latestHandBills = latestPage.handBills;
                // Filter out already processed handbills
            const newHandBills = latestHandBills.filter(
                    (handbill) => !processedIdsRef.current.has(handbill.id)
            );
            if (containerRef.current && newHandBills.length > 0) {
                const container = containerRef.current;
                const newBoardList = processHandBills(
                        boardList,
                        newHandBills,
                        container.clientWidth,
                        container.clientHeight
                );
                // Update the set of processed IDs
                newHandBills.forEach((handbill) => processedIdsRef.current.add(handbill.id));
                setBoardList(newBoardList);
            }
        }
    }, [data]);

    const onHandBillHover = useCallback((handBillId: number | null) => {
        setHoveredHandBillId(handBillId);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 800 && hasNextPage && !isFetchingNextPage && !isFetching) {
            fetchNextPage();
        }
    };

    if (!isLocationValid) {
        return (
            <div className={styles.loadingContainer}>
                <Spin tip="Fetching your location..." />
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
                <div className={styles.whiteboard}>
                    <div className={styles.locationMapContainer}>
                        <LocationMap
                            boardList={boardList}
                            hoveredHandBillId={hoveredHandBillId}
                        />
                    </div>
                    <Divider type="vertical" style={{ height: '100%' }} />
                    <div
                        className={styles.handbillContainer}
                        ref={containerRef} // Assign the ref here
                        onScroll={handleScroll}
                    >
                        
                        {
                            isFetching && !isFetchingNextPage ? (
                                <div className={styles.loadingContainer}> 
                                    <Spin tip="Getting handbills around you..." />
                                </div>) : (
                                    <HandbillLayer
                                    boardList={boardList}
                                    onHandBillHover={onHandBillHover}
                                    />
                                )
                        }
                        
                        {isFetchingNextPage && (
                            <div className={styles.loadingMoreContainer}>
                                <Spin tip="Loading more handbills..." />
                            </div>
                        )}
                    </div>
                </div>
            
        </div>
    );
};

export default React.memo(MainBoard);