import { useState } from "react";
import { uploadOutfit } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function UploadOutfit(){
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);

        try{
            const res = await uploadOutfit(formData);
            navigate(`/outfits/${res.data.id}/recommendations`);
        } catch (error){
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Upload Outfit</h1>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
            />
            {loading && <LoadingIndicator />}
            <button type="submit" className="form-button">Upload</button>
        </form>
    );
}

export default UploadOutfit