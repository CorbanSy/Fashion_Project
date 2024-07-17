import React, { useState, useEffect, useRef } from "react"; // Properly import React
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/VirtualCloset.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import male_mann from "../assets/male-mann-body.jpg";
import Draggable from 'react-draggable';

const categories = [
    { name: "Hats", subcategories: ["Hat"] },
    { name: "Tops", subcategories: ["Blazer", "Blouse", "Body", "Dress", "Hoodie", "Longsleeve", "Outwear", "Pants", "Polo", "Shirt", "T-Shirt", "Top", "Undershirt"] },
    { name: "Bottoms", subcategories: ["Shorts", "Skirt", "Pants"] },
    { name: "Shoes", subcategories: ["Shoes"] },
    { name: "Not Sure/Other", subcategories: ["Not sure", "Other", "Skip"] },
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
    };

    const handleGenerateOutfitClick = () => {
        setGenerateCanvasOpen(true);
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

    const handleResetCanvas = () => {
        setCanvasItems([]);
    };

    const handleRemoveItem = (item) => {
        console.log("Removing item: ", item); // Log the item to be removed
        setCanvasItems(prevItems => prevItems.filter(ci => ci.id !== item.id));
    };

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

            {isCreateCanvasOpen && (
                <div className="canvas-container">
                    <button className="close-button" onClick={closeCreateCanvas}>×</button>
                    <div className="canvas">
                        <img src={male_mann} alt="Mannequin" className="mannequin-image" ref={mannequinRef} />
                        {canvasItems.map((item, index) => (
                            <Draggable
                                key={index}
                                defaultPosition={{ x: item.x, y: item.y }}
                                onStop={(e, data) => handleDragStop(e, data, item)}
                                nodeRef={item.ref}
                            >
                                <div className={`closet-item ${item.isOnMannequin ? 'on-mannequin' : ''}`} ref={item.ref} onDoubleClick={() => handleRemoveItem(item)}>
                                    <img src={item.item_image} alt={item.item_name} />
                                    <h4>{item.item_name}</h4>
                                </div>
                            </Draggable>
                        ))}
                    </div>
                    <div className="canvas-buttons">
                        <button className="reset-button" onClick={handleResetCanvas}>Reset</button>
                        <button className="confirm-button" onClick={handleConfirmOutfit}>Confirm Outfit</button>
                    </div>
                </div>
            )}

            {isGenerateCanvasOpen && (
                <div className="canvas-container">
                    <button className="close-button" onClick={closeGenerateCanvas}>×</button>
                </div>
            )}

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
