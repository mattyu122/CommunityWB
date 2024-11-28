import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { customIcon } from '../../../component/Icon/HandbillIcon';
import { useCurrentLocation } from '../../../hooks/useCurrentLocation';
import { HandBill } from '../../../models/HandBill';
interface MapSectionProps {
selectedHandBill: HandBill;
}

const MapSection: React.FC<MapSectionProps> = ({
    selectedHandBill,
}) => {
    const { currentLocation ,getCurrentLocation } = useCurrentLocation();
    /** Fetch user location on mount */
    useEffect(() => {
        const fetchLocation = async () => {
            await getCurrentLocation();
        };
        fetchLocation();
    }, []);
    return (
    <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer
        center={selectedHandBill.location!}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={selectedHandBill.location!} icon={customIcon}/>
        {currentLocation && <Marker position={currentLocation}/>}
        </MapContainer>
    </div>
    );
};

export default MapSection;