import React from 'react';
import "../styles/ConfirmationModal.css"

function ConfirmationModal({ itemName, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirmation</h2>
                <p>The clothing was identified as <strong>{itemName}</strong>.</p>
                <p>Do you want to add it to your closet?</p>
                <button className="confirm-button" onClick={onConfirm}>Add to Closet</button>
                <button className="cancel-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default ConfirmationModal;
