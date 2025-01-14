import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Image } from 'antd'; // Import Image for PreviewGroup
import React, { useRef, useState } from 'react';
import LinkButton from '../../../../component/Button/LinkButton';
import styles from '../../../../css/HandBillModal/MediaCarousel.module.css';
import { HandBillMedia } from '../../../../models/HandBillMedia';

interface MediaCarouselProps {
mediaList: HandBillMedia[];
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ mediaList }) => {
const [currentIndex, setCurrentIndex] = useState<number>(0);
const carouselRef = useRef<any>(null);

const handleCarouselChange = (index: number) => {
    console.log("index", index);

setCurrentIndex(index);
}

const goToNext = () => {
carouselRef.current?.next();
}


const goToPrevious = () => {
carouselRef.current?.prev();
}

return (
<div style={{ position: 'relative', flex: 1 }}>
    {currentIndex > 0 && (
    <LinkButton
        className={`${styles.arrow} ${styles.leftArrow}`}
        onClick={goToPrevious}
        icon={<LeftOutlined />}
    />
    )}
        <Carousel
            ref={carouselRef}
            afterChange={handleCarouselChange}
            infinite={false}
            className={styles.carouselContainer}
            swipe
            draggable
        >
            {mediaList.map((media, index) => (
            <div key={index} className={styles.carouselItem}>
                {media.mediaType === 'video' ? (
                    <video
                        autoPlay   // Make it autoplay
                        muted      // Required by most browsers for autoplay
                        controls   // Optional — if you still want visible controls
                        loop         // Optional, if you want it to repeat
                        height="100%"
                        width="100%"
                        
                        src={media.mediaUrl}
                        className={styles.video}
                    />
                ) : (
                    <Image
                        height="80vh"
                        width="100%"
                        src={media.mediaUrl}
                        alt={`Media ${index}`}
                        className={styles.img}
                    />
                )}
            </div>
            ))}
        </Carousel>
    {currentIndex < mediaList.length - 1 && (
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

export default MediaCarousel;