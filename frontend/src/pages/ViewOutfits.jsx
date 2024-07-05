import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/ViewOutfits.css"; // Make sure you have this CSS file

function ViewOutfits() {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await axios.get('/outfits/');
                if (Array.isArray(response.data)) {
                    setOutfits(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching outfits:', error);
            }
        };

        fetchOutfits();
    }, []);

    return (
        <div className="view-outfits-container">
            <h1>View Outfits</h1>
            <div className="outfits-grid">
                {outfits.map((outfit, index) => (
                    <div key={outfit.id || index} className="outfit-box">
                        <h2>{outfit.name || `Outfit ${index + 1}`}</h2>
                        <img src={outfit.image} alt={outfit.name} />
                        {/* Add more outfit details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewOutfits;
