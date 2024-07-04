import { useState } from "react";
import { uploadOutfit, uploadClothingItem } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "../components/LoadingIndicator";

function UploadOutfit(){
    const [image, setOutfitImage] = useState(null);
    const [clothingImage, setClothingImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOutfitSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", outfitImageimage);

        try{
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
        formData.append("image", clothingImage);

        try{
            await uploadClothingItem(formData);
            alert('Clothin item uploaded successfully!');
        } catch(error){
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
                    onChange={(e) => setOutfitImage(e.target.files[0])}
                    required
                />
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>

            <form onSubmit={handleClothingSubmit} className="form-container">
                <h1>Upload Clothing Item</h1>
                <input
                    type="file"
                    accept="image/"
                    onChange={(e) => setClothingImage(e.target.files[0])}
                    required
                />
                {loading && <LoadingIndicator />}
                <button type="submit" className="form-button">Upload</button>
            </form>
        </div>
    );
}

export default UploadOutfit