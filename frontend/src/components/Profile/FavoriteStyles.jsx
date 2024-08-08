import React from 'react';
import { useProfile } from './ProfileContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const FavoriteStyles = () => {
    const { 
        profileData: { favorite_styles }, // Nested destructuring
        stylesOptions,
        showStylesDropdown,
        handleAddStyles,
        handleSelectStyles,
        handleRemoveStyle 
    } = useProfile();

    return (
        <div className="form-group favorite-styles-container">
            <label>Favorite Styles</label>
            <div className="favorite-styles">
                {favorite_styles.map((style, index) => (
                    <div key={index} className="style-badge">
                        {style}
                        <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveStyle(style)} className="remove-icon" />
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddStyles}>Add Styles</button>
            {showStylesDropdown && (
                <select multiple onChange={handleSelectStyles}>
                    {stylesOptions.map((style, index) => (
                        <option key={index} value={style}>{style}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default FavoriteStyles;
