// CommentsSection.tsx

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image, List, Spin, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef
} from 'react';
import { useCommentPagesInfiniteQuery } from '../../../api/Comment/commentQuery';
import styles from "../../../css/CommentsSection.module.css";
import { HandBill } from '../../../models/HandBill';
import { useBrowsedHandbillsStore } from '../../../stores/browsedHandBillStore';
const { Text } = Typography;
export interface CommentsSectionHandle {
getCurrentPage: () => number;
getScrollPosition: () => number;
}

interface CommentsSectionProps {
selectedHandBill: HandBill;
}

const CommentsSection = React.forwardRef<CommentsSectionHandle, CommentsSectionProps>(({ selectedHandBill }, ref) => {
    const { getBrowsedHandbillEntry } = useBrowsedHandbillsStore();
    const entry = getBrowsedHandbillEntry(selectedHandBill.id);
    const commentsRef = useRef<HTMLDivElement>(null);
    const scrollPositionSet = useRef(false);
    // Expose internal commentsRef methods to HandbillModal
    useImperativeHandle(ref, () => ({
        getCurrentPage: () => {
        return data?.pages.length ? data.pages.length - 1 : 0;
        },
        getScrollPosition: () => commentsRef.current?.scrollTop || 0,
    }));

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

    // Flatten all pages of comments into a single array
    const allComments = React.useMemo(() => {
        console.log("Data:", data);
        return data
        ? data.pages.flatMap((page) => page?.comments || [])
        : [];
    }, [data]);

    // Set scroll position after comments are loaded
    useEffect(() => {
        if (
        entry &&
        commentsRef.current &&
        !scrollPositionSet.current &&
        allComments.length > 0
        ) {
        commentsRef.current.scrollTop = entry.scrollPosition || 0;
        scrollPositionSet.current = true;
        }
    }, [allComments, entry]);

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
    return (
        <div onScroll={handleScroll} ref={commentsRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* Handbill Caption as a List */}
            <List itemLayout="horizontal">
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar src={selectedHandBill.user.imageUrl} icon={<UserOutlined/>}/>}
                    title={
                        <div>
                        <Text mark>{selectedHandBill.user.fullname}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                            {formatDistanceToNow(new Date(selectedHandBill.createdAt), { addSuffix: true })}
                        </Text>
                        </div>
                    }
                    description={<Text>{selectedHandBill.caption}</Text>}
                    />
                </List.Item>
            </List>
            <List
                itemLayout="horizontal"
                dataSource={allComments}
                renderItem={(comment) => (
                    <List.Item key={comment.id}>
                        <List.Item.Meta
                            avatar={<Avatar src={comment.user.imageUrl} icon={<UserOutlined/>}/>}
                            title={
                                <div>
                                    {comment.user.id === selectedHandBill.user.id ? 
                                    <Text mark>{comment.user.fullname}</Text> :
                                    <Text strong>{comment.user.fullname}</Text>
                                    }
                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                        {formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true})}
                                    </Text>
                                </div>
                            }
                            description={
                                    <div>
                                        <div className={styles.commentMediaContainer}>
                                            {comment.commentMedia &&
                                            <Image.PreviewGroup>
                                                {
                                                    comment.commentMedia.map((media) => (
                                                        <div className={styles.commentMedia}>
                                                            <Image src={media.mediaUrl} alt="Full Size"/>
                                                        </div>
                                                    ))
                                                }
                                            </Image.PreviewGroup>
                                            }
                                        </div>
                                        <Text>{comment.content}</Text>
                                    </div>
                            }
                        />
                    </List.Item>
                )}
            />
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