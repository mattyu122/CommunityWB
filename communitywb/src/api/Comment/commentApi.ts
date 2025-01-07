import { GetCommentPageDto } from "../../dto/comment/getCommentPageDto";
import { PinCommentDto } from "../../dto/comment/PinCommentDto";
import { axiosClient, axiosClientMultipart } from "../axios/axiosClient";


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
            },
        });
        const commentPage: GetCommentPageDto = data;
        console.log('commentPage', commentPage);
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

export const getPinnedComments = async ({
    handbillId,
    page,
    size = 20,
}: CommentQueryParams) => {
    try{
        const { data } = await axiosClientMultipart.get(`/comment/pinned/${handbillId}`,{
            params: {
                page,
                size,
            },
        });
        const pinnedComments: GetCommentPageDto[] = data;
        return pinnedComments;
    }catch(error){
        console.error('Error fetching pinned comments:', error);
        throw new Error('Failed to fetch pinned comments.');
    }
}

export const pinComment = async ({
    commentId,
    handbillId,
    userId,
    }: PinCommentDto) => {
    try{
        console.log('commentId', commentId);
        console.log('handbillId', handbillId);
        const response = await axiosClient.post(`/comment/pin`,{
                commentId,
                handbillId,
                userId
        });
        return response.data;
    }catch(error){
        console.error('Error pinning comment:', error);
        throw new Error('Failed to pin comment.');
    }
}