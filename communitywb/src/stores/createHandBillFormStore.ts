// src/stores/uploadBillStore.ts
import { RcFile } from 'antd/es/upload/interface';
import { LatLng } from 'leaflet';
import { create } from 'zustand';
interface UploadBillState {
file: RcFile[] | null;
caption: string;
location: LatLng | null;
address: string;
imagePreview: string[] | null;
currentStage: number;
setFile: (file: RcFile[] | null) => void;
setCaption: (caption: string) => void;
setLocation: (location: LatLng | null) => void;
setAddress: (address: string) => void;
setImagePreview: (preview: string[] | null) => void;
setCurrentStage: (stage: number) => void;
resetForm: () => void;
}

export const useUploadBillStore = create<UploadBillState>((set) => ({
file: null,
caption: '',
location: new LatLng(40.7128, -74.0060),
address: '',
imagePreview: null,
currentStage: 0,
setFile: (file) => set({ file }),
setCaption: (caption) => set({ caption }),
setLocation: (location) => set({ location }),
setAddress: (address) => set({ address }),
setImagePreview: (imagePreview) => set({ imagePreview }),
setCurrentStage: (currentStage) => set({ currentStage }),
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