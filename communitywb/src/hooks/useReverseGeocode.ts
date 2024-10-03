import { LatLng } from 'leaflet';
import { useState } from 'react';
import { axiosClient } from '../api/axiosClient';

export const useReverseGeocode = () => {
    const [address, setAddress] = useState<string>('');

    const fetchReverseGeocode = async (location: LatLng) => {
    try {
        const response = await axiosClient.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
            lat: location.lat,
            lon: location.lng,
            format: 'json',
        },
        });
        if (response.data?.display_name) {
        setAddress(response.data.display_name);
        }
    } catch (error) {
        console.error('Error fetching reverse geocode:', error);
    }
    };

    return { address, setAddress,fetchReverseGeocode };
};