import { useState } from 'react';

export function useBrush() {
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  
  /**
   * Start a new drawing path at the given coordinates
   */
  const startDrawing = (x, y) => {
    return `M${x},${y}`;
  };
  
  /**
   * Continue drawing the path to the new coordinates
   */
  const continueDrawing = (currentPath, x, y) => {
    return `${currentPath} L${x},${y}`;
  };
  
  /**
   * End the current drawing path
   */
  const endDrawing = (currentPath) => {
    return currentPath;
  };
  
  /**
   * Change the brush size
   */
  const changeBrushSize = (size) => {
    setBrushSize(size);
  };
  
  /**
   * Change the brush opacity
   */
  const changeBrushOpacity = (opacity) => {
    setBrushOpacity(opacity);
  };
  
  return {
    brushSize,
    brushOpacity,
    startDrawing,
    continueDrawing,
    endDrawing,
    changeBrushSize,
    changeBrushOpacity,
  };
}