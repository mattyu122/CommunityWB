import { LatLng } from "leaflet";

export interface AddHandBillDTO {
    file: File;
    caption: string;
    width: number;
    height: number;
    location: LatLng | null;
    address: string;
}

export class AddHandBillForm {
    static toFormData(handBill: AddHandBillDTO): FormData {
        const formData = new FormData();

        formData.append('file', handBill.file);
        formData.append('caption', handBill.caption);
        formData.append('width', handBill.width.toString());
        formData.append('height', handBill.height.toString());
        formData.append('address', handBill.address);

        if (handBill.location) {
        formData.append('location.lat', handBill.location.lat.toString());
        formData.append('location.lng', handBill.location.lng.toString());
        }

        return formData;
    }
}