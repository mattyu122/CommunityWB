// External Libraries
import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, message, Spin, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef,
    useState
} from 'react';

// Local Hooks, Queries, and Components
import { useCommentPagesInfiniteQuery, usePinCommentMutation } from '../../../../api/Comment/commentQuery';
import CommentItemBase from '../../../../component/Comment/CommentItemBase';
import { withPinBehavior } from '../../../../component/Comment/CommentWithPinBehavior';
import { withReplyBehavior } from '../../../../component/Comment/CommentWithReplyBehavior';
import { useBrowsedHandbillsStore } from '../../../../stores/browsedHandBillStore';
import { useUserStore } from '../../../../stores/userStateStore';

// Types and Models
import { Comment } from '../../../../models/Comment';
import { HandBill } from '../../../../models/HandBill';

// Styles

const { Text } = Typography;

/** Exposed ref methods for parent components (e.g., HandbillModal). */
export interface CommentsSectionHandle {
getCurrentPage: () => number;
getScrollPosition: () => number;
}

interface CommentsSectionProps {
selectedHandBill: HandBill;
}

/** Reducer to manage comment states (set, toggle pin, etc.). */
function commentsReducer(state: Comment[], action: { type: string; payload: any }) {
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
}

/** Higher-order component that provides both reply & pin behavior. */
const CommentItemWithReplyPin = withReplyBehavior(withPinBehavior(CommentItemBase));

/**
 * Displays a list of comments for a given HandBill, with infinite scrolling,
 * pin functionality, and reply behavior.
 */
const CommentsSection = React.forwardRef<CommentsSectionHandle, CommentsSectionProps>(
({ selectedHandBill }, ref) => {
    // ===== Store hooks =====
    const { getBrowsedHandbillEntry } = useBrowsedHandbillsStore();
    const { user } = useUserStore();

    // ===== Refs =====
    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollPositionSet = useRef(false);

    // ===== Local state =====
    const [hoveredCommentId, setHoveredCommentId] = useState<number | null>(null);
    const [comments, dispatch] = useReducer(commentsReducer, []);

    // ===== Data from store =====
    const entry = getBrowsedHandbillEntry(selectedHandBill.id);

    // ===== Queries and Mutations =====
    const { mutate: pinComment, isSuccess: pinSuccess, data: pinData } = usePinCommentMutation();

    // Infinite query for comments
    const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
    } = useCommentPagesInfiniteQuery({
    handbillId: selectedHandBill.id,
    enabled: true
    });

    // ===== Expose ref methods to parent =====
    useImperativeHandle(ref, () => ({
    getCurrentPage: () => (data?.pages.length ? data.pages.length - 1 : 0),
    getScrollPosition: () => commentsRef.current?.scrollTop || 0
    }));

    // ===== Effects =====

    /** Flatten all pages of comments into a single array whenever query data changes. */
    useEffect(() => {
    if (data) {
        const flattenedComments = data.pages.flatMap((page) => page?.comments || []);
        dispatch({ type: 'SET_COMMENTS', payload: flattenedComments });
    }
    }, [data]);

    /** Restore the user's last scroll position after comments are loaded. */
    useEffect(() => {
    if (
        entry &&
        commentsRef.current &&
        !scrollPositionSet.current &&
        comments.length > 0
    ) {
        commentsRef.current.scrollTop = entry.scrollPosition || 0;
        scrollPositionSet.current = true;
    }
    }, [comments, entry]);

    /** Show success message upon pinning/unpinning a comment. */
    useEffect(() => {
    if (pinSuccess) {
        if (pinData?.pinned) {
        message.success('Pinned comment');
        } else {
        message.success('Unpinned comment');
        }
    }
    }, [pinSuccess, pinData]);

    /** Load additional comment pages if user had previously browsed multiple pages. */
    useEffect(() => {
    const loadPages = async () => {
        if (entry && data?.pages.length === 0) {
        for (let i = 0; i <= entry.lastSeenPage; i++) {
            await fetchNextPage();
        }
        }
    };
    loadPages();
    }, [entry, fetchNextPage, data?.pages.length]);

    // ===== Callbacks =====

    /** Scroll event handler for infinite loading. */
    const handleScroll = useCallback(() => {
    if (commentsRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = commentsRef.current;
        if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
        ) {
        fetchNextPage();
        }
    }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    /** Toggle a comment's pinned status (if user is valid). */
    const handlePinComment = useCallback(
    (comment: Comment) => {
        if (!user) return;
        dispatch({ type: 'TOGGLE_PIN', payload: { id: comment.id } });
        pinComment({ commentId: comment.id, handbillId: comment.handbillId, userId: user.id });
    },
    [pinComment, user]
    );

    /** Handle replying to a comment (placeholder for future implementation). */
    const handleReplyComment = useCallback((comment: Comment) => {
    console.log('handleReplyComment', comment);
    // Implement reply logic here
    }, []);

    // ===== Render =====
    return (
    <div
        ref={commentsRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '20px' }}
    >
        {/* Handbill Caption at the Top */}
        <List itemLayout="horizontal">
        <div style={{ position: 'relative', padding: 10 }}>
            <List.Item key={selectedHandBill.id}>
            <List.Item.Meta
                avatar={
                <Avatar
                    src={selectedHandBill.user.imageUrl}
                    icon={<UserOutlined />}
                />
                }
                title={
                <div>
                    <Text style={{ color: '#4096ff' }}>
                    {selectedHandBill.user.fullname}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                    {formatDistanceToNow(new Date(selectedHandBill.createdAt), {
                        addSuffix: true
                    })}
                    </Text>
                </div>
                }
                description={
                <div>
                    {/* <div className={styles.commentMediaContainer}>
                    {selectedHandBill.handbillMedia && (
                        <Image.PreviewGroup>
                        {selectedHandBill.handbillMedia.map((media, index) => (
                            <div
                            className={styles.commentMedia}
                            key={media.mediaUrl || index}
                            >
                            <Image src={media.mediaUrl} alt="Full Size" />
                            </div>
                        ))}
                        </Image.PreviewGroup>
                    )}
                    </div> */}
                    <Text>{selectedHandBill.caption}</Text>
                </div>
                }
            />
            </List.Item>
        </div>
        </List>

        {/* Comments List */}
        <List
        itemLayout="horizontal"
        dataSource={comments as Comment[]}
        split={false}
        renderItem={(comment) => (
            <CommentItemWithReplyPin
            key={comment.id}
            comment={comment}
            handbill={selectedHandBill}
            handlePinComment={handlePinComment}
            handleReplyComment={handleReplyComment}
            hoveredCommentId={hoveredCommentId}
            setHoveredCommentId={setHoveredCommentId}
            />
        )}
        />

        {/* Loading Indicator */}
        {(isFetching || isFetchingNextPage) && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <Spin tip="Loading more comments..." />
        </div>
        )}
    </div>
    );
}
);

export default React.memo(CommentsSection);
