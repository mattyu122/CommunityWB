import { useState } from 'react';
import '../css/Whiteboard.css';
const Whiteboard = () => {
    const [images, setImages] = useState([]);
    //1. api get request to get all images
    //2. setImages with response
    //3. set up white board with fixed height and width
    //4. map through images and display them
    
    return (
    <div className="whiteboard">
        <div className="photo-display">
            {images.map((image, index) => (
            <img key={index} src={image} alt={`uploaded-${index}`} />
            ))}
        </div>
    </div>
);
};

export default Whiteboard;
