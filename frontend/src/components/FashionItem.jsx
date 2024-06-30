import React from "react";
import '../styles/FashionItem.css';

function FashionItem({item}){
    return (
        <div className="fashion-item">
            <img src ={item.image_url} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
        </div>
    )
}

export default FashionItem;