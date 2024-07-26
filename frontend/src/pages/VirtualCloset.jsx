import React, { useState, useEffect, useRef } from "react"; // Properly import React
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/VirtualCloset_css_files/virtual-closet-container.css";
import "../styles/VirtualCloset_css_files/title.css";
import "../styles/VirtualCloset_css_files/button-list.css";
import "../styles/VirtualCloset_css_files/category-section.css";
import "../styles/VirtualCloset_css_files/modal.css";
import "../styles/VirtualCloset_css_files/closet-item.css";
import "../styles/VirtualCloset_css_files/mannequin.css";
import "../styles/VirtualCloset_css_files/button-container.css";
import "../styles/VirtualCloset_css_files/canvas-container.css";
import "../styles/VirtualCloset_css_files/generate-parameters.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import male_mann from "../assets/male-mann-body.jpg";
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const categories = [
    { name: "Hats", subcategories: ["Hat"] },
    { name: "Tops", subcategories: ["Blazer", "Blouse", "Body", "Dress", "Hoodie", "Longsleeve", "Outwear", "Pants", "Polo", "Shirt", "T-Shirt", "Top", "Undershirt"] },
    { name: "Bottoms", subcategories: ["Shorts", "Skirt", "Pants"] },
    { name: "Shoes", subcategories: ["Shoes"] },
    { name: "Not Sure/Other", subcategories: ["Not sure", "Other", "Skip"] },
];

const styleOptions = [
    '00s', '20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s',
    'Androgynous', 'Artsy', 'Ballerina', 'Basic', 'Beach', 'Biker', 'Boho', 'Business casual',
    'Casual', 'Comfy', 'Country', 'Dark Academia', 'Eclectic', 'Edgy', 'Elegant', 'Ethereal',
    'Feminine', 'Folk', 'Formal', 'French', 'Fun', 'Funky', 'Garconne', 'Geek chic', 'Girl next door',
    'Glamorous', 'Goth', 'Granola', 'Grunge', 'Hipster', 'Kooky', 'Lagenlook', 'Masculine', 'Military',
    'Minimalist', 'Modest', 'Prairie', 'Preppy', 'Punk', 'Racy', 'Rocker', 'Romantic', 'Skateboard',
    'Sporty', 'Street', 'Toddler', 'Traditional', 'Vintage'
];

const colorOptions = [
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

const eventOptions = [
    'Casual', 'Formal', 'Party', 'Business', 'Sports', 'Vacation', 'Wedding', 'Interview', 'Date Night'
];

const zones = {
    head: { x: 120, y: 50, width: 60, height: 60 },
    torso: { x: 100, y: 110, width: 100, height: 120 },
    legs: { x: 110, y: 230, width: 80, height: 120 },
    feet: { x: 110, y: 350, width: 80, height: 40 },
};

const itemZoneMapping = {
    Hat: 'head',
    Blazer: 'torso',
    Blouse: 'torso',
    Body: 'torso',
    Dress: 'torso',
    Hoodie: 'torso',
    Longsleeve: 'torso',
    Outwear: 'torso',
    Pants: 'legs',
    Polo: 'torso',
    Shirt: 'torso',
    'T-Shirt': 'torso',
    Top: 'torso',
    Undershirt: 'torso',
    Shorts: 'legs',
    Skirt: 'legs',
    Shoes: 'feet',
};

function VirtualCloset() {
    const [closetItems, setClosetItems] = useState([]);
    const [isCreateCanvasOpen, setCreateCanvasOpen] = useState(false);
    const [isGenerateCanvasOpen, setGenerateCanvasOpen] = useState(false);
    const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryModalTitle, setCategoryModalTitle] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [canvasItems, setCanvasItems] = useState([]);
    const [itemRefs, setItemRefs] = useState({});
    const [desiredColors, setDesiredColors] = useState([]);
    const [desiredStyle, setDesiredStyle] = useState([]);
    const [event, setEvent] = useState("");
    const [showColorsDropdown, setShowColorsDropdown] = useState(false);
    const [showStylesDropdown, setShowStylesDropdown] = useState(false);
    const [showEventsDropdown, setShowEventsDropdown] = useState(false);

    const mannequinRef = useRef(null);

    useEffect(() => {
        getClosetItems();
    }, []);

    useEffect(() => {
        const initialRefs = {};
        closetItems.forEach(item => {
            initialRefs[item.id] = React.createRef();
        });
        setItemRefs(initialRefs);
    }, [closetItems]);

    const getClosetItems = () => {
        api
            .get("/virtual-closet/")
            .then((res) => res.data)
            .then((data) => {
                setClosetItems(data);
            })
            .catch((err) => console.error("error fetching outfits: ", err));
    };

    const handleCreateOutfitClick = () => {
        setCreateCanvasOpen(true);
        setGenerateCanvasOpen(false);
    };

    const handleGenerateOutfitClick = () => {
        setGenerateCanvasOpen(true);
        setCreateCanvasOpen(false);
    };

    const closeCreateCanvas = () => {
        setCreateCanvasOpen(false);
        setCanvasItems([]);
    };

    const closeGenerateCanvas = () => {
        setGenerateCanvasOpen(false);
    };

    const handleSubcategoryClick = (subcategory) => {
        const items = closetItems.filter(item => item.category && item.category.toLowerCase() === subcategory.toLowerCase());
        setSelectedCategoryItems(items);
        setCategoryModalTitle(subcategory);
        setCategoryModalOpen(true);
    };

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [categoryName]: !prevState[categoryName]
        }));
    };

    const closeModal = () => {
        setCategoryModalOpen(false);
    };

    const handleItemClick = (item) => {
        setCanvasItems(prevItems => [
            ...prevItems,
            {
                ...item,
                x: 0,
                y: 0,
                ref: itemRefs[item.id]
            }
        ]);
        setCategoryModalOpen(false);
    };

    const handleDragStop = (e, data, item) => {
        const mannequin = mannequinRef.current.getBoundingClientRect();
        const itemRect = item.ref.current.getBoundingClientRect();

        const itemCategory = item.category;
        const zoneName = itemZoneMapping[itemCategory];
        const zone = zones[zoneName];

        const zoneX = mannequin.left + zone.x;
        const zoneY = mannequin.top + zone.y;
        const zoneWidth = zone.width;
        const zoneHeight = zone.height;

        if (itemRect.left < zoneX + zoneWidth && itemRect.right > zoneX && itemRect.top < zoneY + zoneHeight && itemRect.bottom > zoneY) {
            // Adjust position to fit the mannequin
            const x = data.x - mannequin.left - (itemRect.width / 2);
            const y = data.y - mannequin.top - (itemRect.height / 2);

            setCanvasItems(prevItems => prevItems.map(ci => ci.id === item.id ? { ...ci, x, y, isOnMannequin: true } : ci));
        } else {
            setCanvasItems(prevItems => prevItems.map(ci => ci.id === item.id ? { ...ci, x: data.x, y: data.y, isOnMannequin: false } : ci));
        }
    };

    const handleConfirmOutfit = () => {
        //handle outfit confirmation logic here
        alert("Outfit confirmed!");
    };

    const handleGenerateOutfit = () => {
        //handle outfit generation logic here using desiredColors, desiredStyle, and event
        alert(`Outfit generated with Colors: ${desiredColors.join(', ')}, Style: ${desiredStyle.join(', ')}, Event: ${event}`);
    };

    const handleResetCanvas = () => {
        setCanvasItems([]);
    };

    const handleRemoveItem = (item) => {
        console.log("Removing item: ", item); // Log the item to be removed
        setCanvasItems(prevItems => prevItems.filter(ci => ci.id !== item.id));
    };

    const handleAddColors = () => {
        setShowColorsDropdown(!showColorsDropdown);
    };

    const handleAddStyles = () => {
        setShowStylesDropdown(!showStylesDropdown);
    };

    const handleAddEvent = () => {
        setShowEventsDropdown(!showEventsDropdown);
    };

    const handleSelectColors = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        const newColors = values.filter(value => !desiredColors.includes(value));
        setDesiredColors([...desiredColors, ...newColors]);
        setShowColorsDropdown(false);
    };

    const handleSelectStyles = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        const newStyles = values.filter(value => !desiredStyle.includes(value));
        setDesiredStyle([...desiredStyle, ...newStyles]);
        setShowStylesDropdown(false);
    };

    const handleSelectEvent = (e) => {
        setEvent(e.target.value);
        setShowEventsDropdown(false);
    };

    const handleRemoveColor = (color) => {
        setDesiredColors(desiredColors.filter(c => c !== color));
    };

    const handleRemoveStyle = (style) => {
        setDesiredStyle(desiredStyle.filter(s => s !== style));
    };

    const renderCanvas = () => (
        <div className="canvas-container">
            <button className="close-button" onClick={isCreateCanvasOpen ? closeCreateCanvas : closeGenerateCanvas}>×</button>
            <div className="canvas">
                <img src={male_mann} alt="Mannequin" className="mannequin-image" ref={mannequinRef} />
                {canvasItems.map((item, index) => (
                    <Draggable
                        key={index}
                        defaultPosition={{ x: item.x, y: item.y }}
                        onStop={(e, data) => handleDragStop(e, data, item)}
                        nodeRef={item.ref}
                    >
                        <div
                            className={`closet-item ${item.isOnMannequin ? 'on-mannequin' : ''}`}
                            ref={item.ref}
                            onDoubleClick={() => handleRemoveItem(item)}
                        >
                            <img src={item.item_image} alt={item.item_name} />
                            <h4>{item.item_name}</h4>
                        </div>
                    </Draggable>
                ))}
            </div>
            {isCreateCanvasOpen && (
                <div className="canvas-buttons">
                    <button className="reset-button" onClick={handleResetCanvas}>Reset</button>
                    <button className="confirm-button" onClick={handleConfirmOutfit}>Create Outfit</button>
                </div>
            )}
            {isGenerateCanvasOpen && (
                <div className="generate-parameters">
                    <div className="parameter-group">
                        <label>Desired Colors:</label>
                        <div className="parameter-buttons">
                            <button type="button" onClick={handleAddColors}>Add Colors</button>
                            <div className="selected-parameters">
                                {desiredColors.map((color, index) => {
                                    const colorObject = colorOptions.find(c => c.name === color);
                                    return (
                                        <div key={index} className="color-badge" style={{ backgroundColor: colorObject?.color }}>
                                            {color}
                                            <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveColor(color)} className="remove-icon" />
                                        </div>
                                    );
                                })}
                            </div>
                            {showColorsDropdown && (
                                <select multiple onChange={handleSelectColors}>
                                    {colorOptions.map((color, index) => (
                                        <option key={index} value={color.name}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="parameter-group">
                        <label>Desired Style:</label>
                        <div className="parameter-buttons">
                            <button type="button" onClick={handleAddStyles}>Add Styles</button>
                            <div className="selected-parameters">
                                {desiredStyle.map((style, index) => (
                                    <div key={index} className="style-badge">
                                        {style}
                                        <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveStyle(style)} className="remove-icon" />
                                    </div>
                                ))}
                            </div>
                            {showStylesDropdown && (
                                <select multiple onChange={handleSelectStyles}>
                                    {styleOptions.map((style, index) => (
                                        <option key={index} value={style}>
                                            {style}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="parameter-group">
                        <label>Event:</label>
                        <div className="parameter-buttons">
                            <button type="button" onClick={handleAddEvent}>Select Event</button>
                            <div className="selected-parameters">
                                {event && (
                                    <div className="style-badge">
                                        {event}
                                        <FontAwesomeIcon icon={faTimes} onClick={() => setEvent("")} className="remove-icon" />
                                    </div>
                                )}
                            </div>
                            {showEventsDropdown && (
                                <select onChange={handleSelectEvent}>
                                    <option value="">Select Event</option>
                                    {eventOptions.map((eventOption, index) => (
                                        <option key={index} value={eventOption}>
                                            {eventOption}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <button className="generate-button" onClick={handleGenerateOutfit}>Generate Outfit</button>
                </div>
            )}
        </div>
    );

    return (
        <div className="virtual-closet-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h2 className="virtual-closet-title">Your Virtual Closet</h2>
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
            <div className="button-container">
                <Link to="/view-outfits" className="view-outfits-button">View Outfits</Link>
                <button onClick={handleCreateOutfitClick} className="create-outfit-button">Create Outfit</button>
                <button onClick={handleGenerateOutfitClick} className="generate-outfit-button">Generate Outfit (AI)</button>
            </div>

            {isCreateCanvasOpen && renderCanvas()}
            {isGenerateCanvasOpen && renderCanvas()}

            {isCategoryModalOpen && (
                <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-title-wrapper">
                            <button className="modal-close-button" onClick={closeModal}>×</button>
                            <h2 className="modal-title">{categoryModalTitle}</h2>
                        </div>
                        <div className="category-items">
                            {selectedCategoryItems.length > 0 ? (
                                selectedCategoryItems.map(item => (
                                    <div key={item.id} className={`closet-item`} onClick={() => handleItemClick(item)}>
                                        <img src={item.item_image} alt={item.item_name} />
                                        <h4>{item.item_name}</h4>
                                    </div>
                                ))
                            ) : (
                                <p className="no-items-message">No items found in this category</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VirtualCloset;
