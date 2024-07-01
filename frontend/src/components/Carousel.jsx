import React from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

import logo1 from '../assets/logo1.png'
import logo2 from '../assets/logo2.png'
import logo3 from '../assets/logo3.png'

const Carousel = () => {
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{ delay: 2500 }}
            loop={true}
        >
            <SwiperSlide>
                <img src={logo1} alt="Logo 1" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={logo2} alt="Logo 2" />
            </SwiperSlide>
            <SwiperSlide>
                <img src={logo3} alt="Logo 3" />
            </SwiperSlide>
        </Swiper>
    );
};

export default Carousel;