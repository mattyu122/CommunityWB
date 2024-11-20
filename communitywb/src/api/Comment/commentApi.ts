import { GetCommentPageDto } from "../../dto/comment/getCommentPageDto";
import { axiosClientMultipart } from "../axios/axiosClient";

interface CommentQueryParams {
    handbillId: number;
    page?: number;
    size?: number;
}

export const getCommentPages = async ({
    handbillId,
    page,
    size = 20,
}: CommentQueryParams) => {
    try{
        const { data } = await axiosClientMultipart.get(`/comment/${handbillId}`, {
            params: {
                page,
                size,
                handbillId,
            },
        });
        const commentPage: GetCommentPageDto = data;
        return commentPage;
    }catch(error){

    }
}

export const addComment = async (addCommentForm: FormData) => {
    try{
        const response = await axiosClientMultipart.post('/comment/add',addCommentForm)
        return response.data;
    }catch(error){
        console.error('Error adding comment:', error);
        throw new Error('Failed to add comment.');
    }
}