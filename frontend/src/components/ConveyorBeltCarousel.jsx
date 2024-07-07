import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import api from '../api';
import '../styles/ConveyorBeltCarousel.css';  // Import the CSS file

const ConveyorBeltCarousel = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/virtual-closet/');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const placeholders = [
        { item_name: "Upload Clothing or Upload Outfit", item_image: "" },
        { item_name: "Upload Clothing or Upload Outfit", item_image: "" },
        { item_name: "Upload Clothing or Upload Outfit", item_image: "" },
        { item_name: "Upload Clothing or Upload Outfit", item_image: "" },
    ]

    return (
        <div className="carousel-container">
            <h2>Your Outfits and Clothing Items</h2>
            <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={2000} showDots={true}>
                {(items.length > 0 ? items : placeholders).map((item, index) => (
                    <div key={index} className="carousel-item">
                        <div className={`image-placeholder ${index === 2 ? "middle" : index === 1 || index === 3 ? "side" : "outer"}`}>
                            <span>{item.item_name}</span>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ConveyorBeltCarousel;
