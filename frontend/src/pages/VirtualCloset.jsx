import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Modal from "../components/Modal";
import "../styles/VirtualCloset.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import maleMannequin from "../assets/male-Mannequin.webp";
import femaleMannequin from "../assets/female-Mannequin.webp";

function VirtualCloset() {
    const [closetItems, setClosetItems] = useState([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
    const [isViewOutfitsModalOpen, setViewOutfitsModalOpen] = useState(false);
    const categories = [
        { name: "Hats", subcategories: ["Beanie"] },
        { name: "Tops", subcategories: ["T-shirt", "Jacket", "Long sleeve"] },
        { name: "Bottoms", subcategories: ["Jeans", "Shorts", "Trunks", "Slacks", "Skirt"] },
        { name: "Shoes", subcategories: ["Heels", "Flip Flops", "Sandals"] },
    ];

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

    const categorizedItems = categories.map(category => ({
        category: category.name,
        items: closetItems.filter(item => item.category === category.name.toLowerCase())
    }));

    const handleCreateOutfitClick = () => {
        setCreateModalOpen(true);
    };

    const handleGenerateOutfitClick = () => {
        setGenerateModalOpen(true);
    };

    const handleViewOutfitsClick = () => {
        setViewOutfitsModalOpen(true);
    };

    return (
        <div className="virtual-closet-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h2>Your Virtual Closet</h2>
            <div className="button-list">
                {categories.map(({ name, subcategories }) => (
                    <div key={name} className="category-section">
                        <h3>{name}</h3>
                        {subcategories.map(subcategory => (
                            <button key={subcategory} className="closet-button">{subcategory}</button>
                        ))}
                    </div>
                ))}
            </div>
            <div className="closet-item-list">
                {categorizedItems.map(({ category, items }) => (
                    <div key={category} className="category-section">
                        <h3>{category}</h3>
                        <div className="category-items">
                            {items.map(item => (
                                <div key={item.id} className="closet-item">
                                    <img src={item.image_url} alt={item.item_name} />
                                    <h4>{item.item_name}</h4>
                                </div>
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

            <Modal isOpen={isViewOutfitsModalOpen} onClose={() => setViewOutfitsModalOpen(false)}>
                <h2>View Outfits</h2>
                {/* View outfits content goes here */}
            </Modal>

            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                <h2>Create Outfit</h2>
                {/* Outfit creation content goes here */}
            </Modal>

            <Modal isOpen={isGenerateModalOpen} onClose={() => setGenerateModalOpen(false)}>
                <h2>Generate Outfit (AI)</h2>
                {/* AI outfit generate content goes here */}
            </Modal>
        </div>
    );
}

export default VirtualCloset;
