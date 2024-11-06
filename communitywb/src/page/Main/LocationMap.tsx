import { Button, Slider } from 'antd';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import AddressAutoComplete from '../../component/Map/AddressAutoComplete';
import MapCenter from '../../component/Map/MapCenter';
import MapComponent from '../../component/Map/MapComponent';
import MapReadyHandler from '../../component/Map/MapReadyHandler';
import styles from '../../css/LocationMap.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import { Board } from '../../models/Board';
import { useLocationStore } from '../../stores/locationStore';
    interface LocationMapProps {
        boardListRef: React.MutableRefObject<Board[]>;
        hoveredHandBillId: string | null;
    }
    const customIcon = L.icon({
        iconUrl: '/handbillMapIcon.png', // URL to the image in public directory
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 32], // Anchor so the icon points at the correct position
        popupAnchor: [0, -32] // Adjust popup position
    });

    const enlargedIcon = L.icon({
        iconUrl: '/handbillMapIcon.png',
        iconSize: [48, 48], // Enlarged size for hover
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const LocationMap: React.FC<LocationMapProps> = ({ boardListRef, hoveredHandBillId }) => {
    // Define the custom icon
    const [address, setAddress] = useState<string>('');
    const { fetchReverseGeocode } = useReverseGeocode();
    const { getCurrentLocation } = useCurrentLocation();
    const { currentLocation, location,setLocation, setRadius } = useLocationStore();
    const [modalRadius, setModalRadius] = useState<number>(500);
    const [modalLocation, setModalLocation] = useState<LatLng | null>(currentLocation);
    // Memoize isSameLocation function with no dependencies
    const isSameLocation = useCallback((loc1: LatLng, loc2: LatLng, epsilon = 1e-5) => {
    return (
        Math.abs(loc1.lat - loc2.lat) < epsilon &&
        Math.abs(loc1.lng - loc2.lng) < epsilon
    );
    }, []);

    // Memoize the zero location to avoid recreating it
    const zeroLatLng = useMemo(() => new LatLng(0, 0), []);
    useEffect(() => {
        handleSetCurrentLocation();
    }, []);


    useEffect(() => {
        const fetchReverseGeoCodeFun = async ()=>{
            if (modalLocation) {
                const tmpAddress = await fetchReverseGeocode(modalLocation);
                setAddress(tmpAddress);
            }
        }
        fetchReverseGeoCodeFun();
    }, [modalLocation]);

    const handleSetCurrentLocation = async () => {
        const currentLoc = await getCurrentLocation();
        setModalLocation(currentLoc);
    };



    // Memoize handleOnClickSetLocation function
    const handleOnClickSetLocation = useCallback(() => {
    if (!isSameLocation(modalLocation ?? zeroLatLng, location ?? zeroLatLng)) {
        console.log('Coordinates have changed. Updating location.');
        setLocation(modalLocation ?? zeroLatLng);
    }
    setRadius(modalRadius);
    }, [modalLocation, location, modalRadius]);
    
    // Memoize functions passed as props to child components
    const handleSetModalLocation = useCallback(
    ({ lat, lng }: { lat: number, lng: number }) => setModalLocation(new LatLng(lat, lng)),
    []
    );

    const handleUseCurrentLocation = useCallback(() => {
        getCurrentLocation().then(setModalLocation);
    }, [getCurrentLocation]);

    return (
            <div className={styles.container}>
                <AddressAutoComplete
                    address={address}
                    setAddress={setAddress}
                    setLocation={({ lat, lng }) => handleSetModalLocation({ lat, lng })}
                    onUseCurrentLocation={() => handleUseCurrentLocation()}
                />
                {modalLocation && (
                    <div style={{height: '100%'}}>
                        <MapComponent location={modalLocation} setLocation={setModalLocation}>
                            <MapCenter location={modalLocation} zoom={13} />
                            <MapReadyHandler isOpen={true} />
                            <Circle center={modalLocation} radius={modalRadius} color="blue" fillColor="blue" fillOpacity={0.2} />
                            <MarkerClusterGroup
                                removeOutsideVisibleBounds={true}
                                disableClusteringAtZoom={13}
                                spiderfyOnMaxZoom={true}
                                showCoverageOnHover={false}
                                zoomToBoundsOnClick={true}
                                spiderLegPolylineOptions={{ weight: 1.5, color: '#222' }}
                            >
                            {boardListRef.current.map((board) =>
                                board.handbills.map((handBill) =>
                                    handBill.location && (
                                        <Marker
                                            key={handBill.id}
                                            position={[handBill.location?.lat ?? 0, handBill.location?.lng ?? 0]}
                                            icon={hoveredHandBillId === handBill.id ? enlargedIcon : customIcon}
                                            eventHandlers={{
                                                mouseover: (e) => e.target.openPopup(),
                                                mouseout: (e) => e.target.closePopup(),
                                            }}
                                        >
                                            <Popup>{handBill.caption}</Popup>
                                        </Marker>
                                    )
                                )
                            )}
                            </MarkerClusterGroup>
                        </MapComponent>
                    </div>
                )}
                <Slider min={100} max={5000} value={modalRadius} onChange={setModalRadius} />
                <label >Radius: {modalRadius} meters</label>
                <Button onClick={handleOnClickSetLocation}>
                    Set Location
                </Button>
            </div>
    )
    };

    export default LocationMap;