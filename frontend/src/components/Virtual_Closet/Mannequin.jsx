import React, { forwardRef } from "react";
import "../../styles/VirtualCloset_css_files/mannequin.css";

const Mannequin = forwardRef(({ src }, ref) => (
    <img src={src} alt="Mannequin" className="mannequin-image" ref={ref} />
));

export default Mannequin;
