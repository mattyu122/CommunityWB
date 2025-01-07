import { PushpinFilled, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, List, Space, Tooltip, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import React from "react";
import styles from "../../css/HandBillModal/CommentsSection.module.css";
import { useUserStore } from '../../stores/userStateStore';
import { CommentItemBaseProps } from './CommentWithReplyBehavior';
const { Text } = Typography;

const CommentItemBase: React.FC<CommentItemBaseProps & {
    extraAction?: React.ReactNode;
    }> = ({
        comment,
        handbill,
        handlePinComment,
        hoveredCommentId,
        setHoveredCommentId,
        extraAction,
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
                                            <div className={styles.commentMedia} key={media.mediaUrl || index}>
                                                <Image src={media.mediaUrl} alt="Full Size" />
                                            </div>
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
                    {user?.id === handbill.user.id && (
                        comment.pinned ? (
                            <Tooltip title="Unpin">
                                <Button shape="circle" icon={<PushpinFilled />} onClick={() => handlePinComment?.(comment)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Pin">
                                <Button shape="circle" icon={<PushpinOutlined />} onClick={() => handlePinComment?.(comment)} />
                            </Tooltip>
                        )
                    )}
                    {extraAction}

                </div>
            )}
        </div>
    );
}

export default CommentItemBase;