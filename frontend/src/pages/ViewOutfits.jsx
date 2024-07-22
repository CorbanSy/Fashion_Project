import React, { useEffect, useState } from 'react';
import api from '../api'; // Use the centralized api module
import "../styles/ViewOutfits.css"; // Ensure you have this CSS file

function ViewOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [clothingItems, setClothingItems] = useState([]);

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await api.get('/virtual-closet/');
                if (Array.isArray(response.data)) {
                    const outfits = response.data.filter(item => item.isOutfit);
                    const clothingItems = response.data.filter(item => !item.isOutfit);
                    setOutfits(outfits);
                    setClothingItems(clothingItems);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching outfits:', error);
            }
        };

        fetchOutfits();
    }, []);

    const renderOutfitBox = (outfit, index) => {
        if (outfit) {
            return (
                <div key={outfit.id || index} className="outfit-box">
                    <h2>{outfit.item_name || `Outfit ${index + 1}`}</h2>
                    <img src={outfit.item_image} alt={outfit.item_name || `Outfit ${index + 1}`} />
                </div>
            );
        } else {
            return (
                <div key={index} className="outfit-box placeholder">
                    <h2>Upload Outfit</h2>
                </div>
            );
        }
    };

    const renderClothingBox = (item, index) => {
        if (item) {
            return (
                <div key={item.id || index} className="clothing-box">
                    <h2>{item.item_name || `Clothing Item ${index + 1}`}</h2>
                    <img src={item.item_image} alt={item.item_name || `Clothing Item ${index + 1}`} />
                </div>
            );
        } else {
            return (
                <div key={index} className="clothing-box placeholder">
                    <h2>Upload Clothing</h2>
                </div>
            );
        }
    };

    return (
        <div className="view-outfits-container">
            <h1>View Outfits</h1>
            <div className="outfits-grid">
                {Array.from({ length: 12 }).map((_, index) => renderOutfitBox(outfits[index], index))}
            </div>
            <h1>View Clothing</h1>
            <div className="clothing-grid">
                {Array.from({ length: 12 }).map((_, index) => renderClothingBox(clothingItems[index], index))}
            </div>
        </div>
    );
}

export default ViewOutfits;
