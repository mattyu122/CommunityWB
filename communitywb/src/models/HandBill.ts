import { LatLng } from "leaflet";

export interface HandBill {
    id: string;
    caption: string;
    imageUrl: string;
    file: File;
    location: LatLng | null;
    address: string;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    toFormData?(): FormData;
}