import {
    CopyOutlined,
    TwitterOutlined,
    WhatsAppOutlined,
} from '@ant-design/icons';
import { Button, Input, Space, Tooltip, message } from 'antd';
import React from 'react';
import { HandBill } from '../../../../models/HandBill';

interface ShareSectionProps {
    selectedHandBill: HandBill;
}

const ShareSection: React.FC<ShareSectionProps> = ({ selectedHandBill }) => {
    // Base share URL
    const baseUrl = `http://localhost:3001/handbill/${selectedHandBill.id}`;

    const shareUrl = `${baseUrl}`;

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                message.success('Link copied to clipboard!');
            })
            .catch(() => {
                message.error('Failed to copy the link.');
            });
    };

    const shareViaWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(
            `Check out this handbill: ${shareUrl}`
        )}`;
        window.open(url, '_blank');
    };

    const shareViaTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
        )}&text=${encodeURIComponent(`Check out this handbill!`)}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <Input
                value={shareUrl}
                addonAfter={
                    <Tooltip title="Copy URL">
                        <Button
                            icon={<CopyOutlined />}
                            onClick={copyToClipboard}
                        />
                    </Tooltip>
                }
                readOnly
            />
            <Space style={{ marginTop: 10 }}>
                <Button
                    type="primary"
                    icon={<WhatsAppOutlined />}
                    onClick={shareViaWhatsApp}
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                    Share on WhatsApp
                </Button>
                <Button
                    type="primary"
                    icon={<TwitterOutlined />}
                    onClick={shareViaTwitter}
                    style={{ backgroundColor: '#1DA1F2', borderColor: '#1DA1F2' }}
                >
                    Share on Twitter
                </Button>
            </Space>
        </div>
    );
};

export default ShareSection;