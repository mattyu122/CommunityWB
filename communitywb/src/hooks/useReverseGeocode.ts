import { LatLng } from 'leaflet';
import { axiosClient } from '../api/axios/axiosClient';

export const useReverseGeocode = () => {

    const fetchReverseGeocode = async (location: LatLng) => {
    try {
        const response = await axiosClient.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
            lat: location.lat,
            lon: location.lng,
            format: 'json',
            ZoomControl: 18,
        },
        });
        if (response.data?.display_name) {
        return (response.data.display_name);
        }
    } catch (error) {
        console.error('Error fetching reverse geocode:', error);
    }
    };

    return { fetchReverseGeocode };
};