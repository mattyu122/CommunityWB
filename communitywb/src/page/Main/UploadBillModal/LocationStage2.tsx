// src/components/LocationStage2.tsx
import L from 'leaflet';
import markerIconRetinaPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import AddressAutoComplete from '../../../component/Map/AddressAutoComplete';
import MapCenter from '../../../component/Map/MapCenter';
import MapComponent from '../../../component/Map/MapComponent';
import styles from '../../../css/UploadHandBillModal/LocationStage2.module.css';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { useReverseGeocode } from '../../../hooks/useReverseGeocode';
import { useUploadBillStore } from '../../../stores/createHandBillFormStore';

// Fix missing marker icons
const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIconRetinaPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationStage2: React.FC = () => {
    const { location, setLocation, address, setAddress } = useUploadBillStore();
    const { getCurrentLocation } = useCurrentLocation();
    const { fetchReverseGeocode } = useReverseGeocode();

    const handleSetCurrentLocation = async () => {
        const currentLoc = await getCurrentLocation();
        setLocation(currentLoc);
    };

    useEffect(() => {
    const fetchReverseGeoCodeFun = async () => {
        if (location) {
        const tmpAddress = await fetchReverseGeocode(location);
        setAddress(tmpAddress);
        }
    };
    fetchReverseGeoCodeFun();
    }, [location]);

    return (
    <div className={styles.container}>
        {location && (
        <div className={styles.card}>
            <div className={styles.map}>
            <MapComponent location={location} setLocation={setLocation}>
                <MapCenter location={location} zoom={13} />
            </MapComponent>
            </div>
            <div className={styles.mapControl}>
            <AddressAutoComplete
                address={address}
                setAddress={setAddress}
                setLocation={(position) => {
                const newLocation = L.latLng(position.lat, position.lng);
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

export default React.memo(LocationStage2);