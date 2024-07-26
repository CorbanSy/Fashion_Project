import React, { useState, useEffect, useRef } from "react";
import api from "../api"; // Correct relative path to api.js
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

import VirtualClosetContainer from "../components/Virtual_Closet/VirtualClosetContainer";
import Title from "../components/Virtual_Closet/Title";
import ButtonList from "../components/Virtual_Closet/ButtonList";
import Modal from "../components/Virtual_Closet/Modal";
import ButtonContainer from "../components/Virtual_Closet/ButtonContainer";
import CanvasContainer from "../components/Virtual_Closet/CanvasContainer";

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

    return (
        <VirtualClosetContainer>
            <Title title="Your Virtual Closet" />
            <ButtonList
                categories={categories}
                toggleCategory={toggleCategory}
                handleSubcategoryClick={handleSubcategoryClick}
                expandedCategories={expandedCategories}
            />
            <ButtonContainer
                handleCreateOutfitClick={handleCreateOutfitClick}
                handleGenerateOutfitClick={handleGenerateOutfitClick}
            />
            {isCreateCanvasOpen && (
                <CanvasContainer
                    isCreateCanvasOpen={isCreateCanvasOpen}
                    isGenerateCanvasOpen={isGenerateCanvasOpen}
                    closeCreateCanvas={closeCreateCanvas}
                    closeGenerateCanvas={closeGenerateCanvas}
                    canvasItems={canvasItems}
                    handleDragStop={handleDragStop}
                    handleRemoveItem={handleRemoveItem}
                    handleResetCanvas={handleResetCanvas}
                    handleConfirmOutfit={handleConfirmOutfit}
                    male_mann={male_mann}
                    mannequinRef={mannequinRef}
                    colorOptions={colorOptions}
                    desiredColors={desiredColors}
                    handleAddColors={handleAddColors}
                    handleSelectColors={handleSelectColors}
                    handleRemoveColor={handleRemoveColor}
                    showColorsDropdown={showColorsDropdown}
                    styleOptions={styleOptions}
                    desiredStyle={desiredStyle}
                    handleAddStyles={handleAddStyles}
                    handleSelectStyles={handleSelectStyles}
                    handleRemoveStyle={handleRemoveStyle}
                    showStylesDropdown={showStylesDropdown}
                    eventOptions={eventOptions}
                    event={event}
                    handleAddEvent={handleAddEvent}
                    handleSelectEvent={handleSelectEvent}
                    showEventsDropdown={showEventsDropdown}
                    handleGenerateOutfit={handleGenerateOutfit}
                />
            )}
            {isCategoryModalOpen && (
                <Modal
                    categoryModalTitle={categoryModalTitle}
                    selectedCategoryItems={selectedCategoryItems}
                    handleItemClick={handleItemClick}
                    closeModal={closeModal}
                />
            )}
        </VirtualClosetContainer>
    );
}

export default VirtualCloset;
