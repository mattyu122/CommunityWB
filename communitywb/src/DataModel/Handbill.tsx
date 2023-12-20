class HandBill {
    id: string;
    s3_key: string;
    title: string;
    description: string;
    imageUrl: string;
    file: File;

    constructor(file: File) {
        this.id = "";
        this.s3_key = "";
        this.title = "Test";
        this.description = "Test description";
        this.imageUrl = "";
        this.file = file;
    }
    toFormData(): FormData {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('imageId', this.imageUrl);
        formData.append('s3_photoId', this.s3_key);
        return formData;
    }

}

export default HandBill;