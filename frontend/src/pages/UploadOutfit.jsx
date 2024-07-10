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
    const [clothingItemName, setClothingItemName] = useState("");  // New state for clothing item name
    const [loading, setLoading] = useState(false);
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

    const handleClothingItemNameChange = (e) => {  // Handler for clothing item name change
        setClothingItemName(e.target.value);
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
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClothingSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_name", clothingItemName);  // Ensure the item name is included
        formData.append("item_image", clothingImage);

        try {
            await uploadClothingItem(formData);
            alert('Clothing item uploaded successfully!');
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleOutfitSubmit} className="form-container">
                <h1>Upload Outfit</h1>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleOutfitImageChange}
                    required
                />
                {outfitImagePreview && (
                    <img src={outfitImagePreview} alt="Outfit Preview" className="image-preview" />
                )}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>

            <form onSubmit={handleClothingSubmit} className="form-container">
                <h1>Upload Clothing Item</h1>
                <input
                    type="text"
                    placeholder="Clothing Item Name"
                    value={clothingItemName}
                    onChange={handleClothingItemNameChange}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleClothingImageChange}
                    required
                />
                {clothingImagePreview && (
                    <img src={clothingImagePreview} alt="Clothing Preview" className="image-preview" />
                )}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>
        </div>
    );
}

export default UploadOutfit;
