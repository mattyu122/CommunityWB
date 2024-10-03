import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapReadyHandlerProps {
    isOpen: boolean;
}

const MapReadyHandler: React.FC<MapReadyHandlerProps> = ({ isOpen }) => {
    const map = useMap();

    useEffect(() => {
    if (isOpen) {
        setTimeout(() => {
        map.invalidateSize(); // Adjust the map size when the modal opens
        }, 200); // Slight delay to ensure the map is fully visible before resizing
    }
    }, [map, isOpen]);

    return null;
};

export default MapReadyHandler;