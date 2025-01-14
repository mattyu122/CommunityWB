import { PushpinFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Image, List, Space, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import React from "react";
import styles from "../../css/HandBillModal/CommentsSection.module.css";
import { Comment } from '../../models/Comment';
import { HandBill } from '../../models/HandBill';
import { useUserStore } from '../../stores/userStateStore';
const { Text } = Typography;

export interface CommentItemBaseProps {
    comment: Comment;
    handbill: HandBill;
    hoveredCommentId?: number | null;
    setHoveredCommentId?: (id: number | null) => void;
    extraActions?: React.ReactNode;
}

const CommentItemBase: React.FC<CommentItemBaseProps> = ({
        comment,
        hoveredCommentId,
        setHoveredCommentId,
        extraActions
    })=> {
    const { user } = useUserStore();
    return (
        <div
            onMouseEnter={() => setHoveredCommentId?.(comment.id)}
            onMouseLeave={() => setHoveredCommentId?.(null)}
            className={styles.commentItem}
            style={{ position: 'relative', padding: '10px 10px 10px 10px' }}
        >
            <List.Item key={comment.id}>
                <List.Item.Meta
                    avatar={<Avatar src={comment.user.imageUrl} icon={<UserOutlined />} />}
                    title={
                        <Space>
                            {comment.user.id === user?.id ? (
                                <Text style={{ color: '#4096ff' }}>{comment.user.fullname}</Text>
                            ) : (
                                <Text strong>{comment.user.fullname}</Text>
                            )}
                            <Text type="secondary">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </Text>
                            {comment.pinned && (
                                <PushpinFilled style={{ fontSize: '15px', color: '#D30000' }} />
                            )}
                        </Space>
                    }
                    description={
                        <div>
                            <div className={styles.commentMediaContainer}>
                                {comment.commentMedia && (
                                    <Image.PreviewGroup>
                                        {comment.commentMedia.map((media, index) => (
                                            media.mediaType === 'video' ?
                                            (
                                                <video
                                                    src={media.mediaUrl}
                                                    autoPlay   // Make it autoplay
                                                    muted      // Required by most browsers for autoplay
                                                    controls   // Optional — if you still want visible controls
                                                    loop         // Optional, if you want it to repeat
                                                    className={styles.commentMedia}
                                                />
                                            ):
                                            (
                                                <div className={styles.commentMedia} key={media.mediaUrl || index}>
                                                    <Image src={media.mediaUrl} alt="Full Size" />
                                                </div>
                                            )
                                        ))}
                                    </Image.PreviewGroup>
                                )}
                            </div>
                            <Text>{comment.content}</Text>
                        </div>
                    }
                />
            </List.Item>

            {hoveredCommentId === comment.id && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {extraActions}

                </div>
            )}
        </div>
    );
}

export default CommentItemBase;