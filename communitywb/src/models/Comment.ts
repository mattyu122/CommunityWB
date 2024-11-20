import { CommentMedia } from "./CommentMedia";
import { User } from "./User";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: User;
    handBillId: number;
    commentMedia: CommentMedia[]; // Optional media attachments for the comment
    replies: Comment[]; // Array of replies, allowing for nested comments
}