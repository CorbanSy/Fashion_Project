import React from "react";
import { Link } from "react-router-dom";
import "../../styles/VirtualCloset_css_files/button-container.css";

const ButtonContainer = ({ handleCreateOutfitClick, handleGenerateOutfitClick }) => (
    <div className="button-container">
        <Link to="/view-outfits" className="view-outfits-button">View Outfits</Link>
        <button onClick={handleCreateOutfitClick} className="create-outfit-button">Create Outfit</button>
        <button onClick={handleGenerateOutfitClick} className="generate-outfit-button">Generate Outfit (AI)</button>
    </div>
);

export default ButtonContainer;
