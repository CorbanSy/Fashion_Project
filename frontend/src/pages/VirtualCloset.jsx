import { useState, useEffect } from "react";
import api from "../api";
import "../styles/VirtualCloset.css";
import backgroundImage from "../assets/virtual-closet-background.png.webp";
import maleMannequin from "../assets/male-Mannequin.png.webp";
import femaleMannequin from "../assets/female-Mannequin.png.webp";


function VirtualCloset(){
    const [closetItems, setClosetItems] = useState([]);
    const categories = ["Hats", "Tops", "Bottoms", "Shoes"];

    useEffect(() => {
        getClosetItems();/*test*/
    }, []);

    const getClosetItems = () => {
        api
            .get("/api/virtual-closet/")
            .then((res) => res.data)
            .then((data) => {
                setClosetItems(data);
            })
            .catch((err) => alert(err));
    };

    const categorizedItems = categories.map(category => ({
        category,
        items:closetItems.filter(item=> item.category === category.toLowerCase())
    }));

    return (
        <div className="virtual-closet-container" style={{ backgroundImage: `url(${backgroundImage})`}}>
            <h2>Your Virtual Closet</h2>
            <div className="closet-item-list">
                {categorizedItems.map(({ category, items}) => (
                    <div key ={category} className="category-section">
                        <h3>{category}</h3>
                        <div className="category-items">
                            {items.map(items => (
                                <div key={item.id} className="closet=item">
                                    <img src={item.image.url} alt={item.item_name} />
                                    <h4>{item.item_name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mannequin-container">
                <img src={maleMannequin} alt="Male Mannequin" className="mannequin" />
                <img src={femaleMannequin} alt="Female Mannequin" className="mannequin" />
            </div>
        </div>
    );
}

export default VirtualCloset;