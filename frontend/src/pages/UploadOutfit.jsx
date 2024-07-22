import { useState } from "react";
import { uploadOutfit, uploadClothingItem } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import "../styles/UploadOutfit.css";
import LoadingIndicator from "../components/LoadingIndicator";

function UploadOutfit() {
    const [outfitImage, setOutfitImage] = useState(null);
    const [clothingImage, setClothingImage] = useState(null);
    const [ratingOutfitImage, setRatingOutfitImage] = useState(null);
    const [outfitImagePreview, setOutfitImagePreview] = useState(null);
    const [clothingImagePreview, setClothingImagePreview] = useState(null);
    const [ratingOutfitImagePreview, setRatingOutfitImagePreview] = useState(null);
    const [detectedCategory, setDetectedCategory] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
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

    const handleRatingOutfitImageChange = (e) => {
        const file = e.target.files[0];
        setRatingOutfitImage(file);
        setRatingOutfitImagePreview(URL.createObjectURL(file));
    };

    const handleOutfitSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", outfitImage);

        try {
            const res = await uploadOutfit(formData);
            alert("Outfit uploaded successfully!");
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

    const handleRatingOutfitSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", ratingOutfitImage);

        try {
            const res = await uploadOutfit(formData);
            setRecommendations(res.data.recommendations);
            alert("Outfit uploaded successfully for rating!");
        } catch (error) {
            console.error("Outfit rating upload error:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-forms-container">
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

            <form onSubmit={handleRatingOutfitSubmit} className="form-container">
                <h1>Rate Outfit</h1>
                <input type="file" accept="image/*" onChange={handleRatingOutfitImageChange} required />
                {ratingOutfitImagePreview && <img src={ratingOutfitImagePreview} alt="Rating Outfit Preview" className="image-preview" />}
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>

            {recommendations.length > 0 && (
                <div className="recommendations-container">
                    <h1>Outfit Recommendations</h1>
                    <ul>
                        {recommendations.map((recommendation, index) => (
                            <li key={index}>
                                <p>{recommendation.recommended_item}</p>
                                <p>{recommendation.reason}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UploadOutfit;