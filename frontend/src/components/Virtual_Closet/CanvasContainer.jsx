import React, { useRef } from "react";
import "../../styles/VirtualCloset_css_files/canvas-container.css";
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Mannequin from "./Mannequin";
import ClosetItem from "./ClosetItem";
import GenerateParameters from "./GenerateParameters";

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
}) => {

    const [{ isOver }, drop] = useDrop({
        accept: 'CLOSET_ITEM',
        drop: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round((item.left || 0) + delta.x);
            const top = Math.round((item.top || 0) + delta.y);
            handleDragStop(item, { x: left, y: top });
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="canvas-container" ref={drop}>
                <button className="close-button" onClick={isCreateCanvasOpen ? closeCreateCanvas : closeGenerateCanvas}>×</button>
                <div className="canvas">
                    <Mannequin src={male_mann} ref={mannequinRef} />
                    {canvasItems.map((item, index) => (
                        <DraggableClosetItem
                            key={index}
                            item={item}
                            handleRemoveItem={handleRemoveItem}
                            ref={item.ref || React.createRef()}
                        />
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
        </DndProvider>
    );
};

const DraggableClosetItem = React.forwardRef(({ item, handleRemoveItem }, ref) => {
    const internalRef = useRef(null);
    const [{ isDragging }, drag] = useDrag({
        type: 'CLOSET_ITEM', // Ensure the type is defined
        item: { ...item, ref: internalRef },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(internalRef);

    return (
        <div ref={internalRef} style={{ opacity: isDragging ? 0.5 : 1, position: 'absolute', left: item.x || 400, top: item.y || 50 }}>
            <ClosetItem item={item} handleItemClick={() => handleRemoveItem(item)} />
        </div>
    );
});

export default CanvasContainer;
