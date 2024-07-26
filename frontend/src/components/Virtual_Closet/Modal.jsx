import React from "react";
import "../../styles/VirtualCloset_css_files/modal.css";
import ClosetItem from "./ClosetItem";

const Modal = ({ categoryModalTitle, selectedCategoryItems, handleItemClick, closeModal }) => (
    <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-title-wrapper">
                <button className="modal-close-button" onClick={closeModal}>×</button>
                <h2 className="modal-title">{categoryModalTitle}</h2>
            </div>
            <div className="category-items">
                {selectedCategoryItems.length > 0 ? (
                    selectedCategoryItems.map(item => (
                        <ClosetItem key={item.id} item={item} handleItemClick={handleItemClick} />
                    ))
                ) : (
                    <p className="no-items-message">No items found in this category</p>
                )}
            </div>
        </div>
    </div>
);

export default Modal;
