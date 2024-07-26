import React from "react";
import "../../styles/VirtualCloset_css_files/generate-parameters.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const GenerateParameters = ({
    colorOptions,
    desiredColors,
    handleAddColors,
    handleSelectColors,
    handleRemoveColor,
    showColorsDropdown,
    styleOptions,
    desiredStyle,
    handleAddStyles,
    handleSelectStyles,
    handleRemoveStyle,
    showStylesDropdown,
    eventOptions,
    event,
    handleAddEvent,
    handleSelectEvent,
    showEventsDropdown,
    handleGenerateOutfit
}) => (
    <div className="generate-parameters">
        <div className="parameter-group">
            <label>Desired Colors:</label>
            <div className="parameter-buttons">
                <button type="button" onClick={handleAddColors}>Add Colors</button>
                <div className="selected-parameters">
                    {desiredColors.map((color, index) => {
                        const colorObject = colorOptions.find(c => c.name === color);
                        return (
                            <div key={index} className="color-badge" style={{ backgroundColor: colorObject?.color }}>
                                {color}
                                <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveColor(color)} className="remove-icon" />
                            </div>
                        );
                    })}
                </div>
                {showColorsDropdown && (
                    <select multiple onChange={handleSelectColors}>
                        {colorOptions.map((color, index) => (
                            <option key={index} value={color.name}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
        <div className="parameter-group">
            <label>Desired Style:</label>
            <div className="parameter-buttons">
                <button type="button" onClick={handleAddStyles}>Add Styles</button>
                <div className="selected-parameters">
                    {desiredStyle.map((style, index) => (
                        <div key={index} className="style-badge">
                            {style}
                            <FontAwesomeIcon icon={faTimes} onClick={() => handleRemoveStyle(style)} className="remove-icon" />
                        </div>
                    ))}
                </div>
                {showStylesDropdown && (
                    <select multiple onChange={handleSelectStyles}>
                        {styleOptions.map((style, index) => (
                            <option key={index} value={style}>
                                {style}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
        <div className="parameter-group">
            <label>Event:</label>
            <div className="parameter-buttons">
                <button type="button" onClick={handleAddEvent}>Select Event</button>
                <div className="selected-parameters">
                    {event && (
                        <div className="style-badge">
                            {event}
                            <FontAwesomeIcon icon={faTimes} onClick={() => setEvent("")} className="remove-icon" />
                        </div>
                    )}
                </div>
                {showEventsDropdown && (
                    <select onChange={handleSelectEvent}>
                        <option value="">Select Event</option>
                        {eventOptions.map((eventOption, index) => (
                            <option key={index} value={eventOption}>
                                {eventOption}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
        <button className="generate-button" onClick={handleGenerateOutfit}>Generate Outfit</button>
    </div>
);

export default GenerateParameters;
