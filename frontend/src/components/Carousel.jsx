import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';

import logo1 from '../assets/logo1.png.webp';
import logo2 from '../assets/logo2.png.webp';
import logo3 from '../assets/logo3.png.webp';
import logo4 from '../assets/logo4.png.webp';
import logo5 from '../assets/logo5.png.webp';

const ImageCarousel = () => {
    return (
        <Carousel 
            autoPlay 
            infiniteLoop 
            showThumbs={false} 
            showStatus={false} 
            showArrows={true}
            interval={3000} // 3 seconds per slide
            axis="vertical"
        >
            <div>
                <img src={logo1} alt="Logo 1" />
            </div>
            <div>
                <img src={logo2} alt="Logo 2" />
            </div>
            <div>
                <img src={logo3} alt="Logo 3" />
            </div>
            <div>
                <img src={logo4} alt="Logo 4" />
            </div>
            <div>
                <img src={logo5} alt="Logo 5" />
            </div>
        </Carousel>
    );
};

export default ImageCarousel;
