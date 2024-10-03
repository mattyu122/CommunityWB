import { LatLng } from 'leaflet';
import React from 'react';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';

interface MapComponentProps {
    location: LatLng;
    radius: number;
    setLocation: (location: LatLng) => void;
    children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ location, radius, setLocation, children }) => {
    return (
        <MapContainer center={location} zoom={13} style={{ height: '500px' }}>
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
            <Circle center={location} radius={radius} color="blue" fillColor="blue" fillOpacity={0.2} />
            {children} {/* Insert children here */}
        </MapContainer>
    );
};

export default MapComponent;