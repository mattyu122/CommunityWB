// CommentInput.tsx

import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAddCommentMutation } from '../../../../api/Comment/commentQuery';
import { useHandbillInteractionMutation } from '../../../../api/handbill/handBillQuery';
import { AddCommentDto, AddCommentForm } from '../../../../dto/comment/AddCommentDto';
import { HandbillInteractionType } from '../../../../enum/HandbillInteractionType';
import { HandBill } from '../../../../models/HandBill';
import { useUserStore } from '../../../../stores/userStateStore';
import ConfirmMediaUploadModal from './ConfirmMediaUploadModal';
interface CommentInputProps {
    selectedHandBill: HandBill;
}

const CommentInput: React.FC<CommentInputProps> = ({ selectedHandBill,}) => {
    const [commentText, setCommentText] = useState<string>('');
    const [uploadedFileList, setUploadedFileList] = useState<RcFile[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
    const [commentMediaPreview, setCommentMediaPreview] = useState<string[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const { user } = useUserStore();
    const { mutate: addComment, isSuccess } = useAddCommentMutation();
    const { mutate: addHandBillInteraction,} = useHandbillInteractionMutation();
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
            const beforeUpload = (file: RcFile) => (file.type.startsWith('image/') || file.type.startsWith('video/'));
            const validFiles: RcFile[] = [];
            const previews: string[] = [];

            newFiles.forEach((file) => {
                if (beforeUpload(file)) {
                    validFiles.push(file);
                    const preview = URL.createObjectURL(file);
                    (file as any).preview = preview; // Attach preview to file
                    previews.push(preview);
                }else{
                    message.error('You can only upload image or video files!');
                }
            });

            if (validFiles.length > 0) {
                setUploadedFileList((prevFiles) => [...prevFiles, ...validFiles]);
                setCommentMediaPreview((prevPreviews) => [...prevPreviews, ...previews]);
                setIsConfirmModalVisible(true); // Open the modal only if there are valid files
            }
        },
        []
    );

    /** Handle confirm upload */
    const handleConfirmUpload = useCallback(() => {
        if (!user) {
            message.error('You must be logged in to comment');
            return;
        }
        const trimCommentText = commentText.trim();
        if (!trimCommentText && uploadedFileList.length === 0) return; // Prevent empty submissions

        const addCommentDto: AddCommentDto = {
            content: trimCommentText,
            mediaFiles: uploadedFileList,
            userId: user.id,
            handbillId: selectedHandBill.id,
            parentId: null,
        };
        const formData = AddCommentForm.toFormData(addCommentDto);
        addComment(formData);
        addHandBillInteraction({handbillId: selectedHandBill.id, userId: user.id, interactionType: HandbillInteractionType.COMMENT});
    }, [commentText, uploadedFileList, user, selectedHandBill, addComment, addHandBillInteraction]);

    /** Handle closing the confirm upload modal */
    const handleCloseConfirmModal = useCallback(() => {
        setUploadedFileList([]);
        setCommentMediaPreview([]);
        setIsConfirmModalVisible(false);

    }, []);

    /** Cleanup object URLs to prevent memory leaks */
    useEffect(() => {
        return () => {
            uploadedFileList.forEach((file) => URL.revokeObjectURL((file as any).preview));
        };
    }, []);

    /** Notify parent component when a comment is successfully added */
    useEffect(() => {
        if (isSuccess) {
            messageApi.open({
                type: 'success',
                content: 'Comment post successfully',
            })
            setUploadedFileList([]);
            setCommentMediaPreview([]);
            setCommentText('');
            setIsConfirmModalVisible(false); // Close the modal after confirming
        }
    }, [isSuccess, messageApi]);

    /** Memoize the upload button to prevent re-renders */
    const uploadButton = useMemo(
    () => (
        <Upload
            multiple
            beforeUpload={()=>false}
            showUploadList={false}
            fileList={uploadedFileList}
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
    [handleFileChange]
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
            mediaPreview={commentMediaPreview}
            onClose={handleCloseConfirmModal}
            uploadButton={uploadButton}
            onConfirm={handleConfirmUpload}
        />
    </>
    );
};

export default React.memo(CommentInput);