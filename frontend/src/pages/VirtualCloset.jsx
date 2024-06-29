import { useState, useEffect } from "react";
import api from "../api";
import "../styles/VirtualCloset.css";

function VirtualCloset(){
    const [closetItems, setClosetItems] = useState([]);

    useEffect(() => {
        getClosetItems();
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

    return (
        <div>
            <h2>Your Virtual Closet</h2>
            <div className="closet-item-list">
                {closetItems.map((item) => (
                    <div key={item.id} className="closet-item">
                        <img src={item.item_name} alt={item.item_name} />
                        <h3>{item.item_name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VirtualCloset;