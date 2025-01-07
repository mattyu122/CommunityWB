// commentQuery.ts

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { addComment, getCommentPages, pinComment } from './commentApi';

interface CommentQueryParams {
    handbillId: number;
    size?: number;
    enabled?: boolean;
}

interface pinCommentParams {
    commentId: number;
    handbillId: number;
    userId: number;
}

export const useCommentPagesInfiniteQuery = ({ handbillId, size = 20, enabled = true}: CommentQueryParams) => {
    return useInfiniteQuery({
    queryKey: ['commentPages', handbillId],
    queryFn: ({ pageParam = 0 }) =>
        getCommentPages({ handbillId, page: pageParam, size }),
    getNextPageParam: (GetCommentPageDto) => {
        if (GetCommentPageDto && GetCommentPageDto.currentPage < GetCommentPageDto.totalPages - 1) {
        return GetCommentPageDto.currentPage + 1;
        } else {
        return undefined;
        }
    },
    initialPageParam: 0, // Add this line to specify the initial page parameter
    enabled,
    });
};

export const useAddCommentMutation = () => {
    return useMutation({
    mutationFn: (formData: FormData) => addComment(formData),
    onSuccess: () => {},
    onError: (error) => {
    },
    });
};

export const usePinCommentMutation = () => {
    return useMutation({
    mutationFn: (pinCommentParams: pinCommentParams) => pinComment(pinCommentParams),
    onSuccess: () => {},
    onError: (error) => {
    },
    });
};