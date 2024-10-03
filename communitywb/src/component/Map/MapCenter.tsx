import { LatLng } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapCenterProps {
    location: LatLng;
    zoom?: number;
}

const MapCenter: React.FC<MapCenterProps> = ({ location, zoom = 13 }) => {
    const map = useMap();

    useEffect(() => {
    if (location) {
        map.setView(location, zoom);
    }
    }, [map, location, zoom]);

    return null;
};

export default MapCenter;