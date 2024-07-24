import React, { useEffect, useState } from 'react';
import api from '../api'; // Use the centralized api module
import "../styles/ViewOutfits.css"; // Ensure you have this CSS file

function ViewOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [clothingItems, setClothingItems] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [ratingMode, setRatingMode] = useState(false); // New state for rating mode

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

    const handleDelete = async (id, itemType) => {
        const confirmed = window.confirm(`Are you sure you want to delete this ${itemType}?`);
        if (confirmed) {
            try {
                await api.delete(`/virtual-closet/${id}/`);
                setOutfits(outfits.filter(item => item.id !== id));
                setClothingItems(clothingItems.filter(item => item.id !== id));
            } catch (error) {
                console.error(`Error deleting ${itemType}:`, error);
                alert(`Failed to delete ${itemType}. Please try again.`);
            }
        }
    };

    const handleRateOutfit = (id) => {
        // Logic to handle rating the outfit can be added here
        alert(`Rate outfit with ID: ${id}`);
    };

    const renderOutfitBox = (outfit, index) => {
        if (outfit) {
            return (
                <div key={outfit.id} className="outfit-box">
                    <h2>{outfit.item_name || `Outfit ${index + 1}`}</h2>
                    <img src={outfit.item_image} alt={outfit.item_name || `Outfit ${index + 1}`} />
                    {editMode && (
                        <button className="delete-button" onClick={() => handleDelete(outfit.id, 'outfit')}>X</button>
                    )}
                    {ratingMode && (
                        <button className="select-button" onClick={() => handleRateOutfit(outfit.id)}>Select</button>
                    )}
                </div>
            );
        } else {
            return (
                <div key={`outfit-placeholder-${index}`} className="outfit-box placeholder">
                    <h2>Upload Outfit</h2>
                </div>
            );
        }
    };

    const renderClothingBox = (item, index) => {
        if (item) {
            return (
                <div key={item.id} className="clothing-box">
                    <h2>{item.item_name || `Clothing Item ${index + 1}`}</h2>
                    <img src={item.item_image} alt={item.item_name || `Clothing Item ${index + 1}`} />
                    {editMode && (
                        <button className="delete-button" onClick={() => handleDelete(item.id, 'clothing item')}>X</button>
                    )}
                </div>
            );
        } else {
            return (
                <div key={`clothing-placeholder-${index}`} className="clothing-box placeholder">
                    <h2>Upload Clothing</h2>
                </div>
            );
        }
    };

    return (
        <div className={`view-outfits-container ${editMode ? 'edit-mode' : ''}`}>
            <div className="buttons-container">
                <button className="edit-button" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Done' : 'Edit Closet'}
                </button>
                <button className="rate-button" onClick={() => setRatingMode(!ratingMode)}>
                    {ratingMode ? 'Done' : 'Rate Outfit'}
                </button>
            </div>
            <h1>View Outfits</h1>
            <div className="outfits-grid">
                {outfits.map((outfit, index) => renderOutfitBox(outfit, index))}
            </div>
            <h1>View Clothing</h1>
            <div className="clothing-grid">
                {clothingItems.map((item, index) => renderClothingBox(item, index))}
            </div>
        </div>
    );
}

export default ViewOutfits;
