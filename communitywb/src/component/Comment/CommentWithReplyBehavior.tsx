// withReplyBehavior.tsx

import { MessageOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { Comment } from '../../models/Comment';
import { HandBill } from '../../models/HandBill';

/**
 * The props that the base CommentItem needs. 
 * (We assume your base CommentItem has props for comment, handbill, pin logic, etc.)
 */
export interface CommentItemBaseProps {
    comment: Comment;
    handbill: HandBill;
    handlePinComment?: (comment: Comment) => void;
    hoveredCommentId?: number | null;
    setHoveredCommentId?: (id: number | null) => void;
}

/**
 * Extend the base props with the optional handleReplyComment. 
 * This is what we want the HOC to add.
 */
export interface WithReplyBehaviorProps extends CommentItemBaseProps {
    handleReplyComment?: (comment: Comment) => void;
}

/**
 * HOC that wraps the base component and injects the "Reply" button + logic.
 */
export function withReplyBehavior<OriginalProps extends CommentItemBaseProps>(
    WrappedComponent: React.ComponentType<OriginalProps>
) {
    /**
     * Returns a new component that does everything the base component does,
     * plus renders a "Reply" button in the bottom-right action area 
     * (when hovered and handleReplyComment is provided).
     */
    return function CommentItemWithReply(props: OriginalProps & WithReplyBehaviorProps) {
    const {
        comment,
        hoveredCommentId,
        handleReplyComment,
        ...rest
    } = props;

    // Conditionally render the Reply button if:
    // 1) The user is hovering over this comment, AND
    // 2) A handleReplyComment function is provided.
    const replyButton = hoveredCommentId === comment.id && handleReplyComment && (
        <Tooltip title="Reply">
        <Button
            shape="circle"
            icon={<MessageOutlined />}
            onClick={() => handleReplyComment(comment)}
        />
        </Tooltip>
    );

    /**
     * We now want to pass this `replyButton` to the base component so it can be
     * rendered in the action area.
     *
     * One simple pattern is to add an optional "extraAction" prop to your base
     * component, which the base will render in the bottom-right corner. Then
     * you pass `replyButton` as that "extraAction" prop.
     *
     * For example:
     *
     *   <WrappedComponent
     *     {...(rest as OriginalProps)}
     *     comment={comment}
     *     hoveredCommentId={hoveredCommentId}
     *     extraAction={replyButton}
     *   />
     *
     * If your base component doesn't currently support an extra prop,
     * you could add one or handle it differently.
     * Below we just pass the standard props and rely on the base to use them
     * however it needs.
     */

        return (
            <WrappedComponent
            {...(rest as OriginalProps)}
            comment={comment}
            hoveredCommentId={hoveredCommentId}
            extraAction = {replyButton}
            >
            {/* If your base supports children or a slot, you could place `replyButton` here. */}
            </WrappedComponent>
        );
    };
}
