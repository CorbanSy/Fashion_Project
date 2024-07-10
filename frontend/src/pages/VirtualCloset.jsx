import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import "../styles/VirtualCloset.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import maleMannequin from "../assets/male-Mannequin.webp";
import femaleMannequin from "../assets/female-Mannequin.webp";

const categories = [
    { name: "Hats", subcategories: ["Hat"] },
    { name: "Tops", subcategories: ["Blazer", "Blouse", "Body", "Dress", "Hoodie", "Longsleeve", "Outwear", "Polo", "Shirt", "T-Shirt", "Top", "Undershirt"] },
    { name: "Bottoms", subcategories: ["Shorts", "Skirt", "Pants"] },
    { name: "Shoes", subcategories: ["Shoes"] },
    { name: "Not Sure/Other", subcategories: ["Not sure", "Other", "Skip"] },
];

function VirtualCloset() {
    const [closetItems, setClosetItems] = useState([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
    const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryModalTitle, setCategoryModalTitle] = useState("");

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
        setCreateModalOpen(true);
    };

    const handleGenerateOutfitClick = () => {
        setGenerateModalOpen(true);
    };

    const handleSubcategoryClick = (subcategory) => {
        const items = closetItems.filter(item => item.category === subcategory.toLowerCase());
        setSelectedCategoryItems(items);
        setCategoryModalTitle(subcategory);
        setCategoryModalOpen(true);
    };

    return (
        <div className="virtual-closet-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h2>Your Virtual Closet</h2>
            <div className="button-list">
                {categories.map(({ name, subcategories }) => (
                    <div key={name} className="category-section">
                        <h3>{name}</h3>
                        {subcategories.map(subcategory => (
                            <button key={subcategory} className="closet-button" onClick={() => handleSubcategoryClick(subcategory)}>
                                {subcategory}
                            </button>
                        ))}
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

            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                <h2>Create Outfit</h2>
                {/* Outfit creation content goes here */}
            </Modal>

            <Modal isOpen={isGenerateModalOpen} onClose={() => setGenerateModalOpen(false)}>
                <h2>Generate Outfit (AI)</h2>
                {/* AI outfit generate content goes here */}
            </Modal>

            <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
                <h2>{categoryModalTitle}</h2>
                <div className="category-items">
                    {selectedCategoryItems.length > 0 ? (
                        selectedCategoryItems.map(item => (
                            <div key={item.id} className="closet-item">
                                <img src={item.item_image} alt={item.item_name} />
                                <h4>{item.item_name}</h4>
                            </div>
                        ))
                    ) : (
                        <p>No items found in this category</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default VirtualCloset;
