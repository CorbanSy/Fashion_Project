import React from "react";
import "../../styles/VirtualCloset_css_files/closet-item.css";

const ClosetItem = ({ item, handleItemClick }) => (
    <div className="closet-item" onDoubleClick={() => handleItemClick(item)}>
        <img src={item.item_image} alt={item.item_name} />
        <h4>{item.item_name}</h4>
    </div>
);
export default ClosetItem;
