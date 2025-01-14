// CommentInput.tsx

import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAddCommentMutation } from '../../../../api/Comment/commentQuery';
import { useHandbillInteractionMutation } from '../../../../api/handbill/handBillQuery';
import { HandbillInteractionType } from '../../../../data/enum/HandbillInteractionType';
import { MediaPreview } from '../../../../data/interface/MediaPreview';
import { AddCommentDto, AddCommentForm } from '../../../../dto/comment/AddCommentDto';
import { HandBill } from '../../../../models/HandBill';
import { useCommentMediaUploadStore } from '../../../../stores/createCommentMediaFormStore';
import { useUserStore } from '../../../../stores/userStateStore';
import ConfirmMediaUploadModal from './ConfirmMediaUploadModal';
interface CommentInputProps {
    selectedHandBill: HandBill;
}

const CommentInput: React.FC<CommentInputProps> = ({ selectedHandBill,}) => {
    const [commentText, setCommentText] = useState<string>('');
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
    // const [commentMediaPreview, setCommentMediaPreview] = useState<CommentMediaPreview[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const { user } = useUserStore();
    const { mutate: addComment} = useAddCommentMutation();
    const { mutate: addHandBillInteraction,} = useHandbillInteractionMutation();
    const {commentMediaPreview, setCommentMedia, uploadedFiles, clearCommentMedia} = useCommentMediaUploadStore();
    /** Handle text change */
    const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    },
    []
    );



    /** Handle file uploads */
    const handleFileChange = useCallback(
        (newFiles: RcFile[]) => {
            const updatedPreviews: MediaPreview[] = newFiles.map((file) => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' : 'video',
            }));
            const newAllPreviews = [...commentMediaPreview, ...updatedPreviews];
            const newAllFiles = [...(uploadedFiles || []), ...newFiles];
            setCommentMedia(newAllPreviews, newAllFiles);
            setIsConfirmModalVisible(newAllPreviews.length > 0);
        },
        [commentMediaPreview, setCommentMedia, uploadedFiles]
    );

    const handleConfirmUpload = useCallback(() => {
        if (!user) {
            message.error('You must be logged in to comment');
            return;
        }
        const trimCommentText = commentText.trim();
        if (!trimCommentText &&uploadedFiles && uploadedFiles.length === 0) {
            return; // Prevent empty submissions
        }

        // 1) Close the modal FIRST
        setIsConfirmModalVisible(false);

        // 2) Show "uploading" message
        const messageKey = 'commentUpload';
        messageApi.open({
            key: messageKey,
            type: 'loading',
            content: 'Your comment is uploading...',
            duration: 0, // Set duration to 0 to make it persist
        });

        const addCommentDto: AddCommentDto = {
            content: trimCommentText,
            mediaFiles: uploadedFiles,
            userId: user.id,
            handbillId: selectedHandBill.id,
            parentId: null,
        };
        const formData = AddCommentForm.toFormData(addCommentDto);

        // 3) Call the mutation with onSuccess/onError so we can update the message
        addComment(formData, {
            onSuccess: () => {
                messageApi.open({
                    key: messageKey,
                    type: 'success',
                    content: 'Comment post successfully',
                })
                clearCommentMedia();
                setCommentText('');
                setIsConfirmModalVisible(false); // Close the modal after confirming
            },
            onError: () => {
            messageApi.open({
                key: messageKey,
                type: 'error',
                content: 'Failed to post comment!',
            });
            },
        });

        // Record this as an interaction
        addHandBillInteraction({
            handbillId: selectedHandBill.id,
            userId: user.id,
            interactionType: HandbillInteractionType.COMMENT,
        });
    }, [user, commentText, messageApi, uploadedFiles, selectedHandBill.id, addComment, addHandBillInteraction, clearCommentMedia]);

    /** Handle closing the confirm upload modal */
    const handleCloseConfirmModal = useCallback(() => {
        clearCommentMedia();
        setIsConfirmModalVisible(false);

    }, [clearCommentMedia, setIsConfirmModalVisible]);

    /** Cleanup object URLs to prevent memory leaks */
    useEffect(() => {
        return () => {
            uploadedFiles?.forEach((file) => URL.revokeObjectURL((file as any).preview));
        };
    }, []);

    /** Memoize the upload button to prevent re-renders */
    const uploadButton = useMemo(
    () => (
        <Upload
            multiple
            beforeUpload={()=>false}
            showUploadList={false}
            fileList={uploadedFiles || []}
            onChange={({ fileList }) => {
                const newFiles = fileList
                .map((file) => file.originFileObj as RcFile)
                .filter((file): file is RcFile => !!file);
                handleFileChange(newFiles);
            }}
        >
        <Button shape='circle' icon={<PlusOutlined />} style={{ marginRight: '10px' }}/>
        </Upload>
    ),
    [handleFileChange, uploadedFiles]
    );

    return (
    <>
        {contextHolder}
        <div
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#fff',
        }}
        >
            <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 3 }}
                placeholder="Write a comment..."
                value={commentText}
                onChange={handleTextChange}
                maxLength={2000}
                style={{ flex: 1, marginRight: '10px' }}
            />
            {uploadButton}
            <Button type="primary" onClick={handleConfirmUpload}>
                Submit
            </Button>
        </div>

        {/* Use ConfirmMediaUploadModal */}
        <ConfirmMediaUploadModal
            isVisible={isConfirmModalVisible}
            onClose={handleCloseConfirmModal}
            uploadButton={uploadButton}
            onConfirm={handleConfirmUpload}
        />
    </>
    );
};

export default React.memo(CommentInput);