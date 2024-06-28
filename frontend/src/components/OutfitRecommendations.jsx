import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOutfitRecommendations } from "../api";
import "../styles/Recommendations.css";
import LoadingIndicator from "./LoadingIndicator";

function OutfitRecommendations(){
    const { outfitId } = useParams();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const res = await getOutfitRecommendations(outfitId);
                setRecommendations(res.data);
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecommendations();
    }, [outfitId]);

    return (
        <div className="recommendations-container">
            {loading ? (
                <LoadingIndicator />
            ) : (
                recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="recommendation">
                        <img src={recommendation.recommended_item.image_url} alt={recommendation.recommended_item.name} />
                        <p>{recommendation.reason}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default OutfitRecommendations;