import { LatLng } from 'leaflet';
import { useState } from 'react';

export const useCurrentLocation = (defaultLocation = new LatLng(40.7128, -74.0060)) => {
    const [currentLocation, setCurrentLocation] = useState<LatLng>(defaultLocation);
    const [error, setError] = useState<string | null>(null);

    const getCurrentLocation = (): Promise<LatLng> => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const currentLocation = new LatLng(latitude, longitude);
                        setCurrentLocation(currentLocation);
                        resolve(currentLocation); // Resolve the promise with the current location
                    },
                    (error) => {
                        console.error('Error fetching user location:', error);
                        setError('Error fetching user location');
                        const defaultLoc = defaultLocation; // Set default location
                        setCurrentLocation(defaultLoc);
                        resolve(defaultLoc); // Resolve with default location if geolocation fails
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                setError('Geolocation is not supported by this browser');
                const defaultLoc = defaultLocation; // Set default location
                setCurrentLocation(defaultLoc);
                resolve(defaultLoc); // Resolve with default location
            }
        });
    };

    return { currentLocation, error, getCurrentLocation };
};