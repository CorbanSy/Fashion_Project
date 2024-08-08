import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useProfile } from './ProfileContent';

const FavoriteColors = () => {
    const { favoriteColors, colorsOptions, showColorsDropdown, handleAddColors, handleSelectColors, handleRemoveColor } = useProfile();

    if (!colorsOptions || !favoriteColors) {
        return null; // Handle the case where colorsOptions or favoriteColors are undefined
    }

    return (
        <div className="form-group favorite-colors-container">
            <label>Favorite Colors</label>
            <div className="favorite-colors">
                {favoriteColors.map((color, index) => {
                    const colorObject = colorsOptions.find(c => c.name === color);
                    const isLightColor = ['#FFFF00', '#FFD700', '#C0C0C0', '#E6E6FA', '#FFFFFF'].includes(colorObject?.color);
                    return (
                        <div key={index} className="color-badge" style={{ backgroundColor: colorObject?.color, color: isLightColor ? '#000' : '#fff' }}>
                            {color}
                            <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveColor(color)} className="remove-icon" />
                        </div>
                    );
                })}
            </div>
            <button type="button" onClick={handleAddColors} className="add-colors-button">Add Colors</button>
            {showColorsDropdown && (
                <select multiple onChange={handleSelectColors}>
                    {colorsOptions.map((color, index) => (
                        <option key={index} value={color.name}>
                            {color.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default FavoriteColors;
