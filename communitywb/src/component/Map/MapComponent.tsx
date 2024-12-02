import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { LatLng } from 'leaflet';
import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import styles from '../../css/MapComponent.module.css';
interface MapComponentProps {
    location: LatLng;
    setLocation: (location: LatLng) => void;
    children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ location, setLocation, children }) => {
    const [showAttribution, setShowAttribution] = useState(false); // State for attribution visibility

    const toggleAttribution = () => {
        setShowAttribution((prev) => !prev);
    };
    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <MapContainer center={location} zoom={13} style={{ height: '100%' }} attributionControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            
            <div>
                <FloatButton
                    icon={showAttribution ? <CloseCircleOutlined /> : <InfoCircleOutlined />}
                    style={{ position: 'absolute', top: '12%', left: '2.65%', width: 30, height: 30 }}
                    onClick={toggleAttribution}
                />
            </div>
            {/* Custom Attribution */}
            {showAttribution && (
                <div className={styles.attributionText}>
                    &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                        OpenStreetMap contributors
                    </a>
                </div>
            )}
        </div>
    );
};

export default MapComponent;