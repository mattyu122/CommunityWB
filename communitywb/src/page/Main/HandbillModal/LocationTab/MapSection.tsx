import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { customIcon } from '../../../../component/Icon/HandbillIcon';
import styles from '../../../../css/HandBillModal/MapSection.module.css';
import { useCurrentLocation } from '../../../../hooks/useCurrentLocation';
import { HandBill } from '../../../../models/HandBill';

interface MapSectionProps {
selectedHandBill: HandBill;
}

const MapSection: React.FC<MapSectionProps> = ({
    selectedHandBill,
}) => {
    const { currentLocation ,getCurrentLocation } = useCurrentLocation();
    const [showAttribution, setShowAttribution] = useState(false); // State for attribution visibility

    const toggleAttribution = () => {
        setShowAttribution((prev) => !prev);
    };
    /** Fetch user location on mount */
    useEffect(() => {
        const fetchLocation = async () => {
            await getCurrentLocation();
        };
        fetchLocation();
    }, []);
    return (
    <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer center={selectedHandBill.location!} zoom={13} style={{ height: '100%', width: '100%' }} attributionControl={false}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <Marker position={selectedHandBill.location!} icon={customIcon}/>
            {currentLocation && <Marker position={currentLocation}/>}
        </MapContainer>
        <div>
                <FloatButton
                    icon={showAttribution ? <CloseCircleOutlined /> : <InfoCircleOutlined />}
                    style={{ position: 'absolute', top: '10px', right: '10px', width: 30, height: 30 }}
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

export default MapSection;