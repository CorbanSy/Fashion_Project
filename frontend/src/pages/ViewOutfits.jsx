import React, {useState, useEffect} from 'react';
import api from '../api';
import '../styles/ViewOutfits.css';

function ViewOutfits() {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        //Fetch outfits from the backend API
        api.get('api/outfits/')
            .then((res) => {
                setOutfits(res.data);
            })
            .catch((err) => console.error('Error fetching outfits:', err));
    }, []);

    return (
        <div className="view-outfits-container">
            <h2>View Outfits</h2>
            <div className="outfits-list">
                {outfits.length > 0 ? (
                    outfits.map((outfit, index) => (
                        <div key={outfit.id} className="outfit-item">
                            <h3>{outfit.title || `Outfit #${index + 1}`}</h3>
                            {/* add more outfit details here */}
                        </div>
                    ))
                ) : (
                    <p>No outfits available.</p>
                )}
            </div>
        </div>
    );
}

export default ViewOutfits;