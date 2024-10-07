import L, { LatLng } from 'leaflet';
import markerIconRetinaPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import styles from '../../css/LocationStage2.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';
import AddressAutoComplete from '../Map/AddressAutoComplete';
import MapCenter from '../Map/MapCenter';
import MapComponent from '../Map/MapComponent';
import MapReadyHandler from '../Map/MapReadyHandler';

// Fix missing marker icons
const DefaultIcon = L.icon({
iconUrl: markerIconPng,
iconRetinaUrl: markerIconRetinaPng,
shadowUrl: markerShadowPng,
iconSize: [25, 41],
iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Stage2Props {
    location: LatLng | null;
    address: string;
    setAddress: (address: string) => void;
    setLocation: (position: LatLng) => void;
}

const LocationStage2: React.FC<Stage2Props> = ({ location, address, setLocation, setAddress }) => {
    const { getCurrentLocation } = useCurrentLocation();
    const { fetchReverseGeocode } = useReverseGeocode();


    const handleSetCurrentLocation = async () => {
        const currentLoc = await getCurrentLocation();
        setLocation(currentLoc);
    };


    useEffect(()=>{
        const fetchReverseGeoCodeFun = async ()=>{
            if (location) {
                const tmpAddress = await fetchReverseGeocode(location);
                setAddress(tmpAddress);
            }
        }
        fetchReverseGeoCodeFun();
    }, [location])
    
    return (
    <div className={styles.container}>
        {location && (
        <div className={styles.card}>
            <div className={styles.map}>
                <MapComponent location={location} radius={1000} setLocation={setLocation}>
                    <MapReadyHandler isOpen={true} />
                    <MapCenter location={location} zoom={13} />
                </MapComponent>
            </div>
            <div className={styles.mapControl}>
                <AddressAutoComplete
                    address={address}
                    setAddress={setAddress}
                    setLocation={(position) => {
                    const newLocation = new LatLng(position.lat, position.lon);
                    setLocation(newLocation);
                    }}
                    onUseCurrentLocation={handleSetCurrentLocation}
                />
            </div>
        </div>
        )}
    </div>
    );
};

export default LocationStage2;