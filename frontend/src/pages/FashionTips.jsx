import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import '../styles/FashionTips.css';
import FashionAdviceChatbot from '../components/FashionAdviceChatbot';

const tips = [
    {
        title: "Craft a Capsule Wardrobe",
        content: "Invest in classic pieces that mix and match easily. A great pair of jeans, a simple LBD, and timeless jewelry can take the guesswork out of your mornings.",
        link: "https://www.stitchfix.com",
        category: "Wardrobe Essentials"
    },
    {
        title: "10 Stylish Summer Outfits",
        content: "Discover stylish summer outfits that will keep you cool and fashionable all season long.",
        link: "https://www.thetrendspotter.net/10-stylish-summer-outfits/",
        category: "Seasonal Tips"
    },
    {
        title: "Summer Outfit Ideas",
        content: "Explore various summer outfit ideas to elevate your fashion game.",
        link: "https://www.harpersbazaar.com/fashion/summer-outfit-ideas/",
        category: "Seasonal Tips"
    },
    {
        title: "Summer Fashion Tips",
        content: "Get the best summer fashion tips to stay trendy and comfortable.",
        link: "https://stylishlyme.com/style/summer-fashion-tips/",
        category: "Seasonal Tips"
    },
    {
        title: "How to Dress for Summer",
        content: "Learn how to dress perfectly for summer with these fashion tips.",
        link: "https://www.masterclass.com/articles/how-to-dress-for-summer-fashion-tips/",
        category: "Seasonal Tips"
    },
    {
        title: "Accessorize with Confidence",
        content: "Accessories can transform any outfit. Don't be afraid to mix metals, layer necklaces, or add a bold statement piece to express your personality.",
        link: "https://www.bustle.com/articles/100497-9-fashion-accessorizing-tips",
        category: "Accessorizing"
    },
    {
        title: "How to Accessorize",
        content: "Learn how to accessorize your outfits to enhance your overall look.",
        link: "https://www.rd.com/list/how-to-accessorize/",
        category: "Accessorizing"
    },
    {
        title: "Accessorizing Tips",
        content: "Discover tips and tricks to accessorize like a pro.",
        link: "https://www.nordstrom.com/blog/how-to-accessorize",
        category: "Accessorizing"
    },
    {
        title: "Accessorize Like a Fashionista",
        content: "Find out how to accessorize your outfits like a true fashionista.",
        link: "https://www.masterclass.com/articles/how-to-accessorize",
        category: "Accessorizing"
    },
    {
        title: "Dress for Your Body Type",
        content: "Understanding your body type is key to dressing well. Learn which cuts and styles flatter your shape to always look and feel your best.",
        link: "https://www.stylecraze.com/articles/how-to-dress-according-to-your-body-shape/",
        category: "Body Type Tips"
    },
    {
        title: "How to Dress for Your Body Type",
        content: "Learn how to dress for your body type with these expert tips.",
        link: "https://www.stitchfix.com/women/blog/fashion-tips/how-to-dress-for-your-body-type/",
        category: "Body Type Tips"
    },
    {
        title: "Ultimate Body Shape Guide",
        content: "Unlock the secrets of dressing for your body shape with this ultimate guide.",
        link: "https://www.stylebysavina.com/dress-for-your-body-type-and-shape-guide/",
        category: "Body Type Tips"
    },
    {
        title: "Body Shape Dressing Tips",
        content: "Improve your style with these body shape dressing tips.",
        link: "https://gabriellearruda.com/how-to-dress-for-your-body-type/",
        category: "Body Type Tips"
    },
    {
        title: "Wardrobe Basics",
        content: "Explore the wardrobe basics that every woman should own.",
        link: "https://www.whowhatwear.com/wardrobe-basics",
        category: "Wardrobe Essentials"
    },
    {
        title: "Wardrobe Essentials",
        content: "Discover the wardrobe essentials that will never go out of style.",
        link: "https://editorialist.com/fashion/basics-every-woman-should-own/",
        category: "Wardrobe Essentials"
    },
    {
        title: "Wardrobe Must-Haves",
        content: "Find out the must-have items for a complete and stylish wardrobe.",
        link: "https://www.nordstrom.com/browse/clothing/wardrobe-essentials",
        category: "Wardrobe Essentials"
    },
    {
        title: "Essential Wardrobe Pieces",
        content: "Learn about the essential wardrobe pieces that can elevate your style.",
        link: "https://www.realsimple.com/wardrobe-basics-checklist",
        category: "Wardrobe Essentials"
    },
    {
        title: "Occasion Wear Tips",
        content: "Get tips on how to dress for any occasion with these expert suggestions.",
        link: "https://www.realsimple.com/fashion/clothing/what-to-wear-to-every-occasion",
        category: "Occasion Wear"
    },
    {
        title: "Dress Code Tips",
        content: "Learn about different dress codes and how to dress appropriately for any event.",
        link: "https://www.nordstrom.com/browse/clothing/dress-code-tips",
        category: "Occasion Wear"
    },
    {
        title: "How to Dress for Different Occasions",
        content: "Find out how to dress for various occasions with this comprehensive guide.",
        link: "https://themadpigeon.com/how-to-dress-for-different-occasions-best-style-guide/",
        category: "Occasion Wear"
    },
    {
        title: "What to Wear for Every Occasion",
        content: "Discover what to wear for every occasion with these style tips.",
        link: "https://www.lifehack.org/articles/lifestyle/the-guide-dress-codes-what-wear-every-occasion.html",
        category: "Occasion Wear"
    }
];

const categories = [
    "Seasonal Tips",
    "Occasion Wear",
    "Accessorizing",
    "Wardrobe Essentials",
    "Body Type Tips"
];

const colors = [
    { name: 'Red', color: '#FF0000' },
    { name: 'Crimson', color: '#DC143C' },
    { name: 'Maroon', color: '#800000' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Coral', color: '#FF7F50' },
    { name: 'Salmon', color: '#FA8072' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Gold', color: '#FFD700' },
    { name: 'Green', color: '#008000' },
    { name: 'Lime', color: '#00FF00' },
    { name: 'Olive', color: '#808000' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Navy', color: '#000080' },
    { name: 'Sky Blue', color: '#87CEEB' },
    { name: 'Purple', color: '#800080' },
    { name: 'Lavender', color: '#E6E6FA' },
    { name: 'Magenta', color: '#FF00FF' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Hot Pink', color: '#FF69B4' },
    { name: 'Brown', color: '#A52A2A' },
    { name: 'Chocolate', color: '#D2691E' },
    { name: 'Tan', color: '#D2B48C' },
    { name: 'Gray', color: '#808080' },
    { name: 'Silver', color: '#C0C0C0' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' }
];

const FashionTips = () => {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedColors, setSelectedColors] = useState([]);

    useEffect(() => {
        const category = searchParams.get("category");
        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory("All");
        }
    }, [searchParams]);

    const filteredTips = selectedCategory === "All"
        ? tips
        : tips.filter(tip => tip.category === selectedCategory);

    const handleColorSelect = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const getFilteredColors = () => {
        if (selectedColors.length === 0) {
            return colors;
        }

        // Mock filtering logic: just avoid selecting same color for simplicity.
        return colors.map(c => ({
            ...c,
            dulled: selectedColors.includes(c.name)
        }));
    };

    const filteredColors = getFilteredColors();

    return (
        <div className="fashion-tips-page">
            <div className="sidebar">
                <h2>Fashion Categories</h2>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index} onClick={() => setSelectedCategory(category)}>
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="fashion-tips-container">
                <h1>{selectedCategory} Tips and Tricks</h1>
                <div className="tips-list">
                    {filteredTips.map((tip, index) => (
                        <div key={index} className="tip-item">
                            <h2>{tip.title}</h2>
                            <p>{tip.content}</p>
                            <a href={tip.link} target="_blank" rel="noopener noreferrer">Read more</a>
                        </div>
                    ))}
                </div>
                <FashionAdviceChatbot />
            </div>
            <div className="color-theory-container">
                <h2>Color Theory</h2>
                <div className="color-boxes">
                    {filteredColors.map((color, index) => (
                        <div
                            key={index}
                            className={`color-box ${color.dulled ? 'dulled' : ''}`}
                            style={{ backgroundColor: color.color }}
                            onClick={() => handleColorSelect(color.name)}
                        >
                            {color.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FashionTips;
