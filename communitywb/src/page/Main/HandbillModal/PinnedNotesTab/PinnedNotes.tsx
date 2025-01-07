import { List, message } from "antd";
import { useCallback, useEffect, useReducer, useState } from "react";
import { usePinCommentMutation, usePinnedCommentPagesInfiniteQuery } from "../../../../api/Comment/commentQuery";
import CommentItemBase from "../../../../component/Comment/CommentItemBase";
import { Comment } from '../../../../models/Comment';
import { HandBill } from "../../../../models/HandBill";
import { useUserStore } from "../../../../stores/userStateStore";

interface ImportantNotesProps {
    selectedHandBill: HandBill;
}

// Reducer function to manage comments state
const commentsReducer = (state: Comment[], action: { type: string; payload: any }) => {
    switch (action.type) {
        case 'SET_COMMENTS':
            return action.payload;
        case 'TOGGLE_PIN':
            return state.map((comment) =>
                comment.id === action.payload.id
                    ? { ...comment, pinned: !comment.pinned }
                    : comment
            );
        default:
            return state;
    }
};
const ImportantNotes: React.FC<ImportantNotesProps> = ({selectedHandBill}) => {
    const [comments, dispatch] = useReducer(commentsReducer, [] as Comment[]);
    const [HoveredCommentId, setHoveredCommentId] = useState<number | null>(null);

    const { mutate: pinComment, isSuccess: pinSuccess, data: pinData } = usePinCommentMutation();
    const { user } = useUserStore();

    const handlePinComment = useCallback((comment: Comment) => {
        if (!user) {
            return;
        }
        dispatch({ type: 'TOGGLE_PIN', payload: { id: comment.id } });
        pinComment({ commentId: comment.id, handbillId: comment.handbillId, userId: user.id });
    }, [pinComment, user]);
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = usePinnedCommentPagesInfiniteQuery({
        handbillId: selectedHandBill.id,
        enabled: true,
    });

    useEffect(() => {
        if (pinSuccess) {
            if (pinData.pinned) {
                message.success('Pinned comment');
            } else {
                message.success('Unpinned comment');
            }
        }
    }, [pinSuccess]);
    // Flatten all pages of comments into a single array
    useEffect(() => {
        if (data) {
            const flattenedComments = data.pages.flatMap((page) => page?.comments || []);
            dispatch({ type: 'SET_COMMENTS', payload: flattenedComments });
        }
    }, [data]);
    
    if (isFetching || isFetchingNextPage) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={comments as Comment[]}
                split={false}
                renderItem={(comment) => (
                    <CommentItemBase
                        key={comment.id}
                        comment={comment}
                        handbill={selectedHandBill}
                        handlePinComment={handlePinComment}
                        hoveredCommentId={HoveredCommentId}
                        setHoveredCommentId={setHoveredCommentId}
                    />
                )}
            /> 
        </div>
    )
};

export default ImportantNotes;