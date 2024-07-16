import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/VirtualCloset.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import maleMannequin from "../assets/male-Mannequin.webp";
import femaleMannequin from "../assets/female-Mannequin.webp";
import Draggable from 'react-draggable';

const categories = [
    { name: "Hats", subcategories: ["Hat"] },
    { name: "Tops", subcategories: ["Blazer", "Blouse", "Body", "Dress", "Hoodie", "Longsleeve", "Outwear", "Pants", "Polo", "Shirt", "T-Shirt", "Top", "Undershirt"] },
    { name: "Bottoms", subcategories: ["Shorts", "Skirt", "Pants"] },
    { name: "Shoes", subcategories: ["Shoes"] },
    { name: "Not Sure/Other", subcategories: ["Not sure", "Other", "Skip"] },
];

function VirtualCloset() {
    const [closetItems, setClosetItems] = useState([]);
    const [isCreateCanvasOpen, setCreateCanvasOpen] = useState(false);
    const [isGenerateCanvasOpen, setGenerateCanvasOpen] = useState(false);
    const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryModalTitle, setCategoryModalTitle] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [canvasItems, setCanvasItems] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        getClosetItems();
    }, []);

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
        setDraggedItem(null);
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

    const handleDragStop = (e, data, item) => {
        if (!canvasItems.find(canvasItem => canvasItem.id === item.id)) {
            setCanvasItems(prevItems => [
                ...prevItems,
                {
                    ...item,
                    x: data.x,
                    y: data.y
                }
            ]);
            setDraggedItem(item.id);
        }
    }

    const handleConfirmOutfit = () => {
        //handle outfit confirmation logic here
        alert("Outfit confirmed!");
    }

    const handleResetCanvas = () => {
        setCanvasItems([]);
        setDraggedItem(null);
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
            <div className="mannequin-container">
                <img src={maleMannequin} alt="Male Mannequin" className="mannequin male-mannequin" />
                <img src={femaleMannequin} alt="Female Mannequin" className="mannequin female-mannequin" />
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
                        {canvasItems.map((item, index) => (
                            <Draggable
                                key={index}
                                defaultPosition={{ x: item.x, y: item.y }}
                                onStop={(e, data) => handleDragStop(e, data, item)}
                            >
                                <div className="closet-item">
                                    <img src={item.item_image} alt={item.item_name} />
                                    <h4>{item.item_name}</h4>
                                </div>
                            </Draggable>
                        ))}
                    </div>
                    <button className="confirm-button" onClick={handleConfirmOutfit}>Confirm Outfit</button>
                    <button className="reset-button" onClick={handleResetCanvas}>Reset</button>
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
                                    <Draggable
                                        key={item.id}
                                        onStop={(e, data) => handleDragStop(e, data, item)}
                                    >
                                        <div className={`closet-item ${draggedItem === item.id ? 'dulled' : ''}`}>
                                            <img src={item.item_image} alt={item.item_name} />
                                            <h4>{item.item_name}</h4>
                                        </div>
                                    </Draggable>
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
