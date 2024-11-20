import { LatLng } from 'leaflet';
import { create } from 'zustand';

interface LocationState {
    currentLocation: LatLng | null;
    location: LatLng | null;
    radius: number;
    setCurrentLocation: (location: LatLng) => void;
    setLocation: (location: LatLng) => void;
    setRadius: (radius: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    currentLocation: new LatLng(40.7128, -74.0060), // Default location
    location: null, // Default location
    radius: 500,
    setCurrentLocation: (location: LatLng) => set({ currentLocation: location }),
    setLocation: (location: LatLng) => set({ location }),
    setRadius: (radius: number) => set({ radius }),
}));