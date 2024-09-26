import { LatLng } from "leaflet";

class HandBill {
    id: string;
    s3_key: string;
    caption: string;
    imageUrl: string;
    file: File;
    location: LatLng | null;
    address: string;
    width: number;
    height: number;
    positionX: number;
    positionY: number;

    constructor(file: File, caption: string = "Test", location: LatLng | null, address: string = '',height:number = 150, width:number = 300) {
        this.id = "";
        this.s3_key = "";
        this.caption = caption;
        this.location = location;
        this.imageUrl = "";
        this.address = address;
        this.file = file;
        this.width = width;
        this.height = height;
        this.positionX = 0;
        this.positionY = 0;
    }
    toFormData(): FormData {
        const formData = new FormData();
    
        // Append the file
        formData.append('file', this.file);
    
        // Append the other form data
        formData.append('caption', this.caption);
        formData.append('width', this.width.toString());
        formData.append('height', this.height.toString());
        formData.append('address', this.address);
    
        // Append the location fields (lat, lng, and optionally alt)
        if (this.location) {
            formData.append('location.lat', this.location.lat.toString());
            formData.append('location.lng', this.location.lng.toString());
        }
    
        return formData;
    }

}

export default HandBill;