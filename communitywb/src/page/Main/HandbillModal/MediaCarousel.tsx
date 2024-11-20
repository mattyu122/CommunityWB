// MediaCarousel.tsx

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import LinkButton from '../../../component/Button/LinkButton';
import styles from '../../../css/MediaCarousel.module.css';
import { HandBillMedia } from '../../../models/HandBillMedia';
interface MediaCarouselProps {
mediaList: HandBillMedia[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ mediaList }) => {
const [currentIndex, setCurrentIndex] = useState<number>(0);
const carouselRef = useRef<any>(null);

const handleCarouselChange = useCallback((index: number) => {
setCurrentIndex(index);
}, []);

const goToNext = useCallback(() => {
carouselRef.current?.next();
}, []);

const goToPrevious = useCallback(() => {
carouselRef.current?.prev();
}, []);

return (
<div style={{ position: 'relative', flex: 1 }}>
    {currentIndex !== 0 && (
        <LinkButton
        className={`${styles.arrow} ${styles.leftArrow}`}
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        icon={<LeftOutlined />}
        />
    )}
    <Carousel
    ref={carouselRef}
    afterChange={handleCarouselChange}
    initialSlide={currentIndex}
    className={styles.carouselContainer}
    >
    {mediaList.map((media, index) => (
        <div key={index} className={styles.carouselItem}>
            {media.mediaType === 'VIDEO' ? (
                <video
                src={media.mediaUrl}
                controls
                className={styles.img}
                />
            ) : (
                <img
                src={media.mediaUrl}
                alt={`Media ${index}`}
                className={styles.img}
                />
            )}
        </div>
    ))}
    </Carousel>
    {currentIndex !== mediaList.length - 1 && (
        <LinkButton
        className={`${styles.arrow} ${styles.rightArrow}`}
        onClick={goToNext}
        disabled={currentIndex === mediaList.length - 1}
        icon={<RightOutlined />}
        />
    )}
</div>
);
};

export default React.memo(MediaCarousel);