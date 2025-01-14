    // src/stores/useCommentMediaPreviewStore.ts

    import { RcFile } from 'antd/es/upload';
import { create } from 'zustand';
import { MediaPreview } from '../data/interface/MediaPreview';


    interface CommentMediaPreviewState {
    // The array of media previews
    commentMediaPreview: MediaPreview[];

    // The raw uploaded files (if you need them)
    uploadedFiles: RcFile[] | null;

    // Function to set or update all the commentMediaPreview items
    setCommentMedia: (
    newPreviews: MediaPreview[],
    newFiles?: RcFile[]
    ) => void;

    // A function to clear all previews
    clearCommentMedia: () => void;
    }

    export const useCommentMediaUploadStore = create<CommentMediaPreviewState>(
    (set) => ({
    commentMediaPreview: [],
    uploadedFiles: [],

    setCommentMedia: (newPreviews, newFiles) =>
        set({
            commentMediaPreview: newPreviews,
        // Optionally store the files as well
        uploadedFiles: newFiles ?? [],
        }),

        clearCommentMedia: () =>
        set({
            commentMediaPreview: [],
        uploadedFiles: [],
        }),
    })
    );