import { LatLng } from 'leaflet';
import { useLocationStore } from '../stores/locationStore';

export const useCurrentLocation = () => {
const { currentLocation, setCurrentLocation } = useLocationStore();

const getCurrentLocation = (): Promise<LatLng> => {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;
            const currentLoc = new LatLng(latitude, longitude);
            setCurrentLocation(currentLoc);
            resolve(currentLoc);
            },
            (error) => {
            console.error('Error fetching user location:', error);
            // Handle error, maybe set a default location
            resolve(currentLocation || new LatLng(40.7128, -74.0060));
            }
        );
        } else {
        console.error('Geolocation is not supported by this browser.');
        resolve(currentLocation || new LatLng(40.7128, -74.0060));
        }
    });
};

return {getCurrentLocation };
};