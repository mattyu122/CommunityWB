import { LatLng } from 'leaflet';
import { create } from 'zustand';

// Zustand store for managing global state
const useCreateHandBillFormStore = create((set) => ({
    file: null as File | null,
    caption: '',
    location: new LatLng(40.7128, -74.0060),
    address: '',
    imagePreview: null as string | null,
    currentStage: 0,

    // Actions to update state
    setFile: (file: File | null) => set({ file }),
    setCaption: (caption: string) => set({ caption }),
    setLocation: (location: LatLng) => set({ location }),
    setAddress: (address: string) => set({ address }),
    setImagePreview: (imagePreview: string | null) => set({ imagePreview }),
    setCurrentStage: (currentStage: number) => set({ currentStage }),

    // Reset to initial state
    resetForm: () => set({
            file: null,
            caption: '',
            location: new LatLng(40.7128, -74.0060), // Default to NYC
            address: '',
            imagePreview: null,
            currentStage: 0,
        }),

}));

export default useCreateHandBillFormStore;