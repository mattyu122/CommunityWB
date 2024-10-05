import { Button, Modal, Slider } from 'antd';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is loaded
import React, { useEffect, useState } from 'react';
import { Circle } from 'react-leaflet';
import styles from '../css/LocationMap.module.css';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useReverseGeocode } from '../hooks/useReverseGeocode';
import { useLocationStore } from '../stores/locationStore';
import AddressAutoComplete from './Map/AddressAutoComplete';
import MapCenter from './Map/MapCenter';
import MapComponent from './Map/MapComponent';
import MapReadyHandler from './Map/MapReadyHandler';
    interface LocationMapProps {
        isOpen: boolean;
        onClose: () => void;
    }
    
    const LocationMap: React.FC<LocationMapProps> = ({ isOpen, onClose}) => {
    const [address, setAddress] = useState<string>('');
    const { fetchReverseGeocode } = useReverseGeocode();
    const { getCurrentLocation } = useCurrentLocation();
    const { currentLocation, location,setLocation, setRadius } = useLocationStore();
    const [modalRadius, setModalRadius] = useState<number>(500);
    const [modalLocation, setModalLocation] = useState<LatLng | null>(currentLocation);
    const isSameLocation = (loc1: LatLng, loc2: LatLng, epsilon = 1e-5) => {
        return (
            Math.abs(loc1.lat - loc2.lat) < epsilon &&
            Math.abs(loc1.lng - loc2.lng) < epsilon
        );
    };
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


    const handleOnClickSetLocation = () => {
        if(!isSameLocation(modalLocation?? new LatLng(0,0), location?? new LatLng(0,0))){
            console.log('Coordinates have changed. Updating location.');
            setLocation(modalLocation?? new LatLng(0,0));
        }
        setRadius(modalRadius);
        onClose();
    }
    

    return (
        <Modal
        title="Set Location and Radius"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width="60vw"
        >
            <div className={styles.container}>
                <AddressAutoComplete
                    address={address}
                    setAddress={setAddress}
                    setLocation={({ lat, lon }) => setModalLocation(new LatLng(lat, lon))}
                    onUseCurrentLocation={() => getCurrentLocation().then(setModalLocation)}
                />
                {modalLocation && (
                    <MapComponent location={modalLocation} setLocation={setModalLocation} radius={modalRadius}>
                        <MapCenter location={modalLocation} zoom={13} />
                        <MapReadyHandler isOpen={isOpen} />
                        <Circle center={modalLocation} radius={modalRadius} color="blue" fillColor="blue" fillOpacity={0.2} />
                    </MapComponent>
                )}
                <Slider min={100} max={5000} value={modalRadius} onChange={setModalRadius} />
                <label >Radius: {modalRadius} meters</label>
                <Button type="primary" onClick={handleOnClickSetLocation}>
                    Set Location
                </Button>
            </div>
        </Modal>
    )
    };

    export default LocationMap;