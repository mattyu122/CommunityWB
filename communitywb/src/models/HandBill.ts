import { LatLng } from "leaflet";
import { HandBillMedia } from "./HandBillMedia";
import { User } from "./User";

export interface HandBill {
    id: number;
    caption: string;
    file: File;
    location: LatLng | null;
    address: string;
    width: number;
    height: number;
    user: User;
    handbillMedia: HandBillMedia[];
    positionX: number;
    positionY: number;
    createdAt: string;
    toFormData?(): FormData;
}