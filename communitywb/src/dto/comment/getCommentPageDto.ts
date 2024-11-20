import { Comment } from "../../models/Comment";
export interface GetCommentPageDto {
    comments: Comment[]
    totalPages: number
    pageSize: number
    totalElements: number
    currentPage: number
}