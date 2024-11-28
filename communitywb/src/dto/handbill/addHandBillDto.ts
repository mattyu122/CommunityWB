import { RcFile } from "antd/es/upload";
import { LatLng } from "leaflet";

export interface AddHandBillDTO {
    mediaFiles: RcFile[] | null;
    caption: string;
    width: number;
    height: number;
    location: LatLng | null;
    address: string;
    userId: number;
}

export class AddHandBillForm {
    static toFormData(handBill: AddHandBillDTO): FormData {
        const formData = new FormData();

        handBill.mediaFiles?.forEach((mediaFiles, index) => {
            formData.append(`mediaFiles`, mediaFiles);
        });
        formData.append('caption', handBill.caption);
        formData.append('width', handBill.width.toString());
        formData.append('height', handBill.height.toString());
        formData.append('address', handBill.address);
        formData.append('userId', handBill.userId.toString());
        if (handBill.location) {
        formData.append('location.lat', handBill.location.lat.toString());
        formData.append('location.lng', handBill.location.lng.toString());
        }

        return formData;
    }
}