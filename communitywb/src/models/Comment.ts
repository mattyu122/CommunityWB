import { CommentMedia } from "./CommentMedia";
import { User } from "./User";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: User;
    handbillId: number;
    commentMedia: CommentMedia[]; // Optional media attachments for the comment
    pinned: boolean;
}