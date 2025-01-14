// src/stores/uploadBillStore.ts
import { RcFile } from 'antd/es/upload/interface';
import { LatLng } from 'leaflet';
import { create } from 'zustand';
import { MediaPreview } from '../data/interface/MediaPreview';

// 1) Import or define MediaPreview

interface UploadBillState {
/**
 * The selected files to upload.
 * Store them as an array (or null if you prefer).
 */
file: RcFile[] | null;

/** Caption string. */
caption: string;

/** The chosen location (LatLng) or null if none. */
location: LatLng | null;

/** The address string from, e.g., reverse geocoding. */
address: string;

/**
 * Now using MediaPreview to store both the URL and
 * whether it’s an image or a video.
 */
imagePreview: MediaPreview[] | null;

/** Which stage of the upload form the user is currently on. */
currentStage: number;

// --- Actions (setters) ---
setFile: (file: RcFile[] | null) => void;
setCaption: (caption: string) => void;
setLocation: (location: LatLng | null) => void;
setAddress: (address: string) => void;
setImagePreview: (preview: MediaPreview[] | null) => void;
setCurrentStage: (stage: number) => void;
resetForm: () => void;
}

export const useUploadBillStore = create<UploadBillState>((set) => ({
// --- Initial State ---
file: null,
caption: '',
location: new LatLng(40.7128, -74.0060),
address: '',
imagePreview: null,
currentStage: 0,

// --- Setters ---
setFile: (file) => set({ file }),
setCaption: (caption) => set({ caption }),
setLocation: (location) => set({ location }),
setAddress: (address) => set({ address }),
setImagePreview: (imagePreview) => set({ imagePreview }),
setCurrentStage: (currentStage) => set({ currentStage }),

// --- Reset ---
resetForm: () =>
set({
    file: null,
    caption: '',
    location: new LatLng(40.7128, -74.0060),
    address: '',
    imagePreview: null,
    currentStage: 0,
}),
}));