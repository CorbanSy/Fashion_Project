import React from "react";
import "../../styles/VirtualCloset_css_files/canvas-container.css";
import Draggable from 'react-draggable';
import Mannequin from "./Mannequin";
import ClosetItem from "./ClosetItem";

const CanvasContainer = ({
    isCreateCanvasOpen,
    isGenerateCanvasOpen,
    closeCreateCanvas,
    closeGenerateCanvas,
    canvasItems,
    handleDragStop,
    handleRemoveItem,
    handleResetCanvas,
    handleConfirmOutfit,
    male_mann,
    mannequinRef,
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
    <div className="canvas-container">
        <button className="close-button" onClick={isCreateCanvasOpen ? closeCreateCanvas : closeGenerateCanvas}>×</button>
        <div className="canvas">
            <Mannequin src={male_mann} ref={mannequinRef} />
            {canvasItems.map((item, index) => (
                <Draggable
                    key={index}
                    defaultPosition={{ x: item.x, y: item.y }}
                    onStop={(e, data) => handleDragStop(e, data, item)}
                    nodeRef={item.ref}
                >
                    <ClosetItem item={item} handleItemClick={() => handleRemoveItem(item)} />
                </Draggable>
            ))}
        </div>
        {isCreateCanvasOpen && (
            <div className="canvas-buttons">
                <button className="reset-button" onClick={handleResetCanvas}>Reset</button>
                <button className="confirm-button" onClick={handleConfirmOutfit}>Create Outfit</button>
            </div>
        )}
        {isGenerateCanvasOpen && (
            <GenerateParameters
                colorOptions={colorOptions}
                desiredColors={desiredColors}
                handleAddColors={handleAddColors}
                handleSelectColors={handleSelectColors}
                handleRemoveColor={handleRemoveColor}
                showColorsDropdown={showColorsDropdown}
                styleOptions={styleOptions}
                desiredStyle={desiredStyle}
                handleAddStyles={handleAddStyles}
                handleSelectStyles={handleSelectStyles}
                handleRemoveStyle={handleRemoveStyle}
                showStylesDropdown={showStylesDropdown}
                eventOptions={eventOptions}
                event={event}
                handleAddEvent={handleAddEvent}
                handleSelectEvent={handleSelectEvent}
                showEventsDropdown={showEventsDropdown}
                handleGenerateOutfit={handleGenerateOutfit}
            />
        )}
    </div>
);

export default CanvasContainer;
