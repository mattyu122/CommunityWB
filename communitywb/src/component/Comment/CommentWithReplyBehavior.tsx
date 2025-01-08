// withReplyBehavior.tsx

import { MessageOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { Comment } from '../../models/Comment';
import { CommentItemBaseProps } from './CommentItemBase';



export interface WithReplyBehaviorProps extends CommentItemBaseProps {
    handleReplyComment?: (comment: Comment) => void;
}

export function withReplyBehavior<OriginalProps extends CommentItemBaseProps>(
    WrappedComponent: React.ComponentType<OriginalProps>
) {

    return function CommentItemWithReply(props: OriginalProps & WithReplyBehaviorProps) {
    const {
        comment,
        hoveredCommentId,
        handleReplyComment,
        extraActions,
        ...rest
    } = props;

    const replyButton = hoveredCommentId === comment.id && handleReplyComment && (
        <Tooltip title="Reply">
        <Button
            shape="circle"
            icon={<MessageOutlined />}
            onClick={() => handleReplyComment(comment)}
        />
        </Tooltip>
    );

        return (
            <WrappedComponent
            {...(rest as OriginalProps)}
            comment={comment}
            hoveredCommentId={hoveredCommentId}
            extraActions = {
                <>
                {replyButton}
                {extraActions}
                </>
            }
            >
            {/* If your base supports children or a slot, you could place `replyButton` here. */}
            </WrappedComponent>
        );
    };
}
