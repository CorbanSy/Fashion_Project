import { useState } from "react";
import { uploadOutfit, uploadClothingItem } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import "../styles/UploadOutfit.css";
import LoadingIndicator from "../components/LoadingIndicator";

function UploadOutfit() {
    const [outfitImage, setOutfitImage] = useState(null);
    const [clothingImage, setClothingImage] = useState(null);
    const [outfitImagePreview, setOutfitImagePreview] = useState(null);
    const [clothingImagePreview, setClothingImagePreview] = useState(null);
    const [detectedCategory, setDetectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itemName, setItemName] = useState("");  // Add state for item name
    const [description, setDescription] = useState("");  // Add state for description
    const navigate = useNavigate();

    const handleOutfitImageChange = (e) => {
        const file = e.target.files[0];
        setOutfitImage(file);
        setOutfitImagePreview(URL.createObjectURL(file));
    };

    const handleClothingImageChange = (e) => {
        const file = e.target.files[0];
        setClothingImage(file);
        setClothingImagePreview(URL.createObjectURL(file));
    };

    const handleOutfitSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", outfitImage);

        try {
            const res = await uploadOutfit(formData);
            navigate(`/outfits/${res.data.id}/recommendations`);
        } catch (error) {
            console.error("Outfit upload error:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClothingSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_image", clothingImage);
        formData.append("item_name", itemName);  // Add item name to form data
        formData.append("description", description);  // Add description to form data

        try {
            const res = await uploadClothingItem(formData);
            setDetectedCategory(res.data.category);
            alert(`Clothing item uploaded successfully! Detected category: ${res.data.category}`);
        } catch (error) {
            console.error("Clothing upload error:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleOutfitSubmit} className="form-container">
                <h1>Upload Outfit</h1>
                <input type="file" accept="image/*" onChange={handleOutfitImageChange} required />
                {outfitImagePreview && <img src={outfitImagePreview} alt="Outfit Preview" className="image-preview" />}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>

            <form onSubmit={handleClothingSubmit} className="form-container">
                <h1>Upload Clothing Item</h1>
                <input type="file" accept="image/*" onChange={handleClothingImageChange} required />
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Item Name"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                />
                {clothingImagePreview && <img src={clothingImagePreview} alt="Clothing Preview" className="image-preview" />}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>

            {detectedCategory && (
                <div className="detected-category">
                    <h2>Detected Category: {detectedCategory}</h2>
                </div>
            )}
        </div>
    );
}

export default UploadOutfit;
