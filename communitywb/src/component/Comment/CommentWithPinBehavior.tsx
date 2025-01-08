// withReplyBehavior.tsx

import { PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { Comment } from '../../models/Comment';
import { useUserStore } from '../../stores/userStateStore';
import { CommentItemBaseProps } from './CommentItemBase';


/**
 * Extend the base props with the optional handleReplyComment. 
 * This is what we want the HOC to add.
 */
export interface WithPinBehaviorProps extends CommentItemBaseProps {
    handlePinComment?: (comment: Comment) => void;
}

/**
 * HOC that wraps the base component and injects the "Reply" button + logic.
 */
export function withPinBehavior<OriginalProps extends CommentItemBaseProps>(
    WrappedComponent: React.ComponentType<OriginalProps>
) {
    return function CommentItemWithPin(props: OriginalProps & WithPinBehaviorProps) {
        const { user } = useUserStore();
        const {
            comment,
            handbill,
            hoveredCommentId,
            handlePinComment,
            extraActions,
            ...rest
        } = props;
        const pinButton = user?.id === handbill.user.id && handlePinComment && (
            comment.pinned ? (
                <Tooltip title="Unpin">
                    <Button shape="circle" icon={<PushpinFilled />} onClick={() => handlePinComment?.(comment)} />
                </Tooltip>
            ) : (
                <Tooltip title="Pin">
                    <Button shape="circle" icon={<PushpinOutlined />} onClick={() => handlePinComment?.(comment)} />
                </Tooltip>
            )
        )

        return (
            <WrappedComponent
            {...(rest as OriginalProps)}
            comment={comment}
            hoveredCommentId={hoveredCommentId}
            extraActions = {
                <>
                {pinButton}
                {extraActions}
                </>
            }
            >
            {/* If your base supports children or a slot, you could place `replyButton` here. */}
            </WrappedComponent>
        );
    };
}
