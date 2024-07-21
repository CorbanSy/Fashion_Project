import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import api from '../api';
import '../styles/ConveyorBeltCarousel.css';

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
            items: 5
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 3
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
        { item_name: "Upload Clothing or Upload Outfit", item_image: "" },
    ];

    // Merge items with placeholders
    const displayItems = [...items, ...placeholders];

    return (
        <div className="carousel-container">
            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={2000}
                showDots={false}
                arrows={false}
                customTransition="transform 1s ease-in-out"
                transitionDuration={1000}
                centerMode={true}
                additionalTransfrom={-50}
                keyBoardControl={true}
                removeArrowOnDeviceType={["tablet", "mobile"]}
            >
                {displayItems.map((item, index) => (
                    <div key={index} className="carousel-item">
                        <div className={`image-placeholder ${index === 2 ? "middle" : index === 1 || index === 3 ? "side" : "outer"}`}>
                            {item.item_image ? (
                                <img src={item.item_image} alt={item.item_name} />
                            ) : (
                                <span>{item.item_name}</span>
                            )}
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ConveyorBeltCarousel;
