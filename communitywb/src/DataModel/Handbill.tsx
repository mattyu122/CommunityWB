class HandBill {
    id: string;
    s3_photoId: string;
    title: string;
    description: string;
    imageId: string;
    file: File;

    constructor(file: File) {
        this.id = "";
        this.s3_photoId = "";
        this.title = "Test";
        this.description = "Test description";
        this.imageId = "";
        this.file = file;
    }
    toFormData(): FormData {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('imageId', this.imageId);
        formData.append('s3_photoId', this.s3_photoId);
        return formData;
    }

}

export default HandBill;