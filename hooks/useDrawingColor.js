import { useCallback, useState } from 'react';

export const useDrawingColor = (initialColor = '#FF5252') => {
  const [currentColor, setCurrentColor] = useState(initialColor);

  const changeColor = useCallback((color) => {
    console.log("useDrawingColor: changing color to", color);
    setCurrentColor(color);
  }, []);

  return {
    currentColor,
    changeColor
  };
}; 