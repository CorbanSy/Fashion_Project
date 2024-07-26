import React from "react";
import "../../styles/VirtualCloset_css_files/button-list.css";

const ButtonList = ({ categories, toggleCategory, handleSubcategoryClick, expandedCategories }) => (
    <div className="button-list">
        {categories.map(({ name, subcategories }) => (
            <div key={name} className="category-section">
                <div className="category-header" onClick={() => toggleCategory(name)}>
                    <h3>{name}<span>{expandedCategories[name] ? '▲' : '▼'}</span></h3>
                </div>
                <div className={`subcategory-list ${expandedCategories[name] ? 'show' : ''}`}>
                    {subcategories.map(subcategory => (
                        <button key={subcategory} className="closet-button" onClick={() => handleSubcategoryClick(subcategory)}>
                            {subcategory}
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default ButtonList;
