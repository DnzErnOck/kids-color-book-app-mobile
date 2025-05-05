import { useState } from 'react';

export function useSticker() {
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  
  /**
   * Add a new sticker to the canvas
   */
  const addSticker = (stickerType, x, y, size = 50) => {
    const newSticker = {
      id: `sticker-${Date.now()}`,
      type: stickerType,
      x,
      y,
      size,
      rotation: 0,
    };
    
    setStickers(prev => [...prev, newSticker]);
    return newSticker;
  };
  
  /**
   * Remove a sticker from the canvas
   */
  const removeSticker = (stickerId) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
  };
  
  /**
   * Move a sticker to a new position
   */
  const moveSticker = (stickerId, x, y) => {
    setStickers(prev => 
      prev.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, x, y } 
          : sticker
      )
    );
  };
  
  /**
   * Resize a sticker
   */
  const resizeSticker = (stickerId, size) => {
    setStickers(prev => 
      prev.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, size } 
          : sticker
      )
    );
  };
  
  /**
   * Rotate a sticker
   */
  const rotateSticker = (stickerId, rotation) => {
    setStickers(prev => 
      prev.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, rotation } 
          : sticker
      )
    );
  };
  
  /**
   * Select a sticker for editing
   */
  const selectSticker = (stickerId) => {
    const sticker = stickers.find(s => s.id === stickerId);
    setSelectedSticker(sticker || null);
    return sticker;
  };
  
  /**
   * Clear selection
   */
  const clearSelection = () => {
    setSelectedSticker(null);
  };
  
  return {
    stickers,
    selectedSticker,
    addSticker,
    removeSticker,
    moveSticker,
    resizeSticker,
    rotateSticker,
    selectSticker,
    clearSelection,
  };
}