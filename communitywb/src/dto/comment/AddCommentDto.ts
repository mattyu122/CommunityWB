import { RcFile } from "antd/es/upload";

export interface AddCommentDto{
    content: string | null;
    userId: number;
    handbillId: number;
    mediaFiles: RcFile[] | null;
    parentId: number | null;
}

export class AddCommentForm {
    static toFormData(comment: AddCommentDto): FormData {
        const formData = new FormData();

        comment.mediaFiles?.forEach((mediaFiles, index) => {
            formData.append(`mediaFiles`, mediaFiles);
        });
        if (comment.content) {
            formData.append('content', comment.content);
        }
        formData.append('userId', comment.userId.toString());
        formData.append('handbillId', comment.handbillId.toString());
        if (comment.parentId) {
            formData.append('parentId', comment.parentId.toString());
        }

        return formData;
    }
}