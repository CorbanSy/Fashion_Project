import React from "react";
import '../styles/FashionTips.css';

const tips = [
    {
        title: "Craft a Capsule Wardrobe",
        content: "Invest in classic pieces that mix and match easily. A great pair of jeans, a simple LBD, and timeless jewelry can take the guesswork out of your mornings.",
        link: "https://www.stitchfix.com"
    },
    {
        title: "Summer Outfit Secrets",
        content: "Use a secret formula to create stylish summer outfits effortlessly. Focus on key pieces and avoid common mistakes to keep your style fresh and confident.",
        link: "https://queenbeestyling.com",
    },
    //add more tips as needed
];

const FashionTips = () => {
    return (
        <div className="fashion-tips-container">
            <h1>Fashion Tips and Tricks</h1>
            <div className="tips-list">
                {tips.map((tip, index) => (
                    <div key={index} className="tip-item">
                        <h2>{tip.title}</h2>
                        <p>{tip.content}</p>
                        <a href={tip.link} target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FashionTips;