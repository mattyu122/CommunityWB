// CommentsSection.tsx

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, List, message, Spin, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef,
    useState
} from 'react';
import { useCommentPagesInfiniteQuery, usePinCommentMutation } from '../../../../api/Comment/commentQuery';
import styles from "../../../../css/HandBillModal/CommentsSection.module.css";
import { Comment } from '../../../../models/Comment';
import { HandBill } from '../../../../models/HandBill';
import { useBrowsedHandbillsStore } from '../../../../stores/browsedHandBillStore';
import { useUserStore } from '../../../../stores/userStateStore';
import CommentItem from './CommentItem';

const { Text } = Typography;

export interface CommentsSectionHandle {
    getCurrentPage: () => number;
    getScrollPosition: () => number;
}

interface CommentsSectionProps {
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


const CommentsSection = React.forwardRef<CommentsSectionHandle, CommentsSectionProps>(({ selectedHandBill }, ref) => {
    const { getBrowsedHandbillEntry } = useBrowsedHandbillsStore();
    const { user } = useUserStore();
    const entry = getBrowsedHandbillEntry(selectedHandBill.id);
    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollPositionSet = useRef(false);
    const [HoveredCommentId, setHoveredCommentId] = useState<number | null>(null);
    const { mutate: pinComment, isSuccess: pinSuccess, data: pinData } = usePinCommentMutation();
    const [comments, dispatch] = useReducer(commentsReducer, [] as Comment[]);

    // Fetch comments using the infinite query hook
    const {
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useCommentPagesInfiniteQuery({
        handbillId: selectedHandBill.id,
        enabled: true,
    });

    // Expose internal commentsRef methods to HandbillModal
    useImperativeHandle(ref, () => ({
        getCurrentPage: () => {
            return data?.pages.length ? data.pages.length - 1 : 0;
        },
        getScrollPosition: () => commentsRef.current?.scrollTop || 0,
    }));

    // Flatten all pages of comments into a single array
    useEffect(() => {
        if (data) {
            const flattenedComments = data.pages.flatMap((page) => page?.comments || []);
            dispatch({ type: 'SET_COMMENTS', payload: flattenedComments });
        }
    }, [data]);

    // Set scroll position after comments are loaded
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

    useEffect(() => {
        if (pinSuccess) {
            if (pinData.pinned) {
                message.success('Pinned comment');
            } else {
                message.success('Unpinned comment');
            }
        }
    }, [pinSuccess]);

    /** Handle scroll for infinite loading */
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

    // Load initial pages up to last seen page
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

    const handlePinComment = useCallback((comment: Comment) => {
        if (!user) {
            return;
        }
        dispatch({ type: 'TOGGLE_PIN', payload: { id: comment.id } });
        pinComment({ commentId: comment.id, handbillId: comment.handbillId, userId: user.id });
    }, [pinComment, user]);

    const handleReplyComment = useCallback((commentId: number) => {
        // Implement reply comment logic here
    }, []);

    return (
        <div onScroll={handleScroll} ref={commentsRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* Handbill Caption as a List */}
            <List itemLayout="horizontal">
                <div style={{ position: 'relative', padding: '10px 10px 10px 10px' }}>
                    <List.Item key={selectedHandBill.id}>
                        <List.Item.Meta
                            avatar={<Avatar src={selectedHandBill.user.imageUrl} icon={<UserOutlined />} />}
                            title={
                                <div>
                                    <Text style={{ color: '#4096ff' }}>{selectedHandBill.user.fullname}</Text>
                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                        {formatDistanceToNow(new Date(selectedHandBill.createdAt), { addSuffix: true })}
                                    </Text>
                                </div>
                            }
                            description={
                                <div>
                                    <div className={styles.commentMediaContainer}>
                                        {selectedHandBill.handbillMedia && (
                                            <Image.PreviewGroup>
                                                {selectedHandBill.handbillMedia.map((media, index) => (
                                                    <div className={styles.commentMedia} key={media.mediaUrl || index}>
                                                        <Image src={media.mediaUrl} alt="Full Size" />
                                                    </div>
                                                ))}
                                            </Image.PreviewGroup>
                                        )}
                                    </div>
                                    <Text>{selectedHandBill.caption}</Text>
                                </div>
                            }
                        />
                    </List.Item>
                </div>
            </List>

            <List
                itemLayout="horizontal"
                dataSource={comments as Comment[]}
                split={false}
                renderItem={(comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        handbill={selectedHandBill}
                        handlePinComment={handlePinComment}
                        handleReplyComment={handleReplyComment}
                        hoveredCommentId={HoveredCommentId}
                        setHoveredCommentId={setHoveredCommentId}
                    />
                )}
            />

            {(isFetching || isFetchingNextPage) && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Spin tip="Loading more comments..." />
                </div>
            )}
        </div>
    );
});

export default React.memo(CommentsSection);
