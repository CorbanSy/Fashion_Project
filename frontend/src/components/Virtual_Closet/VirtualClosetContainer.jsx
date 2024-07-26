import React from "react";
import "../../styles/VirtualCloset_css_files/virtual-closet-container.css";
import backgroundImage from "../../assets/virtual-closet-background.png.webp";

const VirtualClosetContainer = ({ children }) => (
    <div className="virtual-closet-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        {children}
    </div>
);

export default VirtualClosetContainer;
