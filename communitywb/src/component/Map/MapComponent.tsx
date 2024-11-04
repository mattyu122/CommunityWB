import { LatLng } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

interface MapComponentProps {
    location: LatLng;
    setLocation: (location: LatLng) => void;
    children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ location, setLocation, children }) => {
    // console.log('MapComponent rerender');
    return (
        <MapContainer center={location} zoom={13} style={{ height: '100%' }}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker
            position={location}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                const marker = e.target as L.Marker;
                const newPos = marker.getLatLng();
                setLocation(newPos);
                },
            }}
            />
            {children}
        </MapContainer>
    );
};

export default MapComponent;