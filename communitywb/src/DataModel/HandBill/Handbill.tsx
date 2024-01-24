class HandBill {
    id: string;
    s3_key: string;
    title: string;
    description: string;
    imageUrl: string;
    file: File;
    width: number;
    height: number;
    positionX: number;
    positionY: number;

    constructor(file: File, height:number, width:number) {
        this.id = "";
        this.s3_key = "";
        this.title = "Test";
        this.description = "Test description";
        this.imageUrl = "";
        this.file = file;
        this.width = width;
        this.height = height;
        this.positionX = 0;
        this.positionY = 0;
    }
    toFormData(): FormData {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('imageId', this.imageUrl);
        formData.append('s3_photoId', this.s3_key);
        formData.append('width', this.width.toString());
        formData.append('height', this.height.toString());
        return formData;
    }

}

export default HandBill;