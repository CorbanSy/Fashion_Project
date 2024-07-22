import { useState } from "react";
import { uploadOutfit, uploadClothingItem, confirmDetectedItems, predictItemDetails } from "../api";
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
    const [detectedItems, setDetectedItems] = useState([]);
    const [confirmingItems, setConfirmingItems] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemName, setItemName] = useState("");
    const navigate = useNavigate();

    const handleOutfitImageChange = (e) => {
        const file = e.target.files[0];
        setOutfitImage(file);
        setOutfitImagePreview(URL.createObjectURL(file));
    };

    const handleClothingImageChange = async (e) => {
        const file = e.target.files[0];
        setClothingImage(file);
        setClothingImagePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const res = await predictItemDetails(formData);
            setItemName(res.data.item_name);
        } catch (error) {
            console.error("Prediction error:", error);
            alert("Error predicting item name.");
        } finally {
            setLoading(false);
        }
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
            setDetectedItems(res.data.detected_items);
            setConfirmingItems(true);
        } catch (error) {
            console.error("Outfit upload error:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmItems = async () => {
        setLoading(true);
        try {
            await confirmDetectedItems({ detected_items: detectedItems });
            alert("Items confirmed and saved successfully!");
            setConfirmingItems(false);
        } catch (error) {
            console.error("Error confirming items:", error);
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
        formData.append("item_name", itemName);

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

            {confirmingItems && (
                <div className="confirmation-container">
                    <h1>Confirm Detected Items</h1>
                    <ul>
                        {detectedItems.map((item, index) => (
                            <li key={index}>
                                <p>{item.item_name}</p>
                                <img src={item.item_image} alt={item.item_name} />
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleConfirmItems} className="form-button">Confirm Items</button>
                </div>
            )}

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
