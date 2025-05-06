import { useCallback, useRef } from 'react';

const BRUSH_TYPES = {
  NORMAL: 'brush',
  PENCIL: 'pencil',
  CHALK: 'chalk',
  RAINBOW: 'rainbow',
  WATERCOLOR: 'watercolor',
  CRAYON: 'crayon',
  HIGHLIGHTER: 'highlighter',
  ROLLER: 'roller',
};

export { BRUSH_TYPES };

export const useBrush = () => {
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef('');
  const brushTypeRef = useRef(BRUSH_TYPES.NORMAL);
  const brushSizeRef = useRef(5);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const currentColorRef = useRef('#000000');

  const startDrawing = useCallback((x, y, color) => {
    isDrawingRef.current = true;
    lastPointRef.current = { x, y };
    lastTimeRef.current = Date.now();
    console.log("useBrush startDrawing with color:", color);
    currentColorRef.current = color || '#000000';
    currentPathRef.current = `M ${x} ${y}`;
    return currentPathRef.current;
  }, []);

  const continueDrawing = useCallback((x, y) => {
    if (!isDrawingRef.current) return currentPathRef.current;

    const lastPoint = lastPointRef.current;
    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTimeRef.current;
    const speed = distance / timeDiff;

    if (distance < 0.5) return currentPathRef.current;

    switch (brushTypeRef.current) {
      case BRUSH_TYPES.CHALK:
        // Tebeşir efekti - kuru ve dağınık
        const chalkSteps = Math.max(4, Math.floor(distance * 4));
        for (let i = 0; i < chalkSteps; i++) {
          const t = i / chalkSteps;
          const currentX = lastPoint.x + dx * t;
          const currentY = lastPoint.y + dy * t;
          // Daha belirgin tebeşir dokusu
          for (let j = 0; j < 2; j++) {
            const offsetX = (Math.random() - 0.5) * brushSizeRef.current * 0.6;
            const offsetY = (Math.random() - 0.5) * brushSizeRef.current * 0.6;
            currentPathRef.current += ` L ${currentX + offsetX} ${currentY + offsetY}`;
          }
        }
        break;

      case BRUSH_TYPES.PENCIL:
        // Kurşun kalem efekti - ince ve keskin
        const pencilSteps = Math.max(3, Math.floor(distance * 3));
        const pencilWidth = brushSizeRef.current * 0.4; // İnce çizgi için
        for (let i = 0; i < pencilSteps; i++) {
          const t = i / pencilSteps;
          const currentX = lastPoint.x + dx * t;
          const currentY = lastPoint.y + dy * t;
          const offsetX = (Math.random() - 0.5) * pencilWidth * 0.2;
          const offsetY = (Math.random() - 0.5) * pencilWidth * 0.2;
          currentPathRef.current += ` L ${currentX + offsetX} ${currentY + offsetY}`;
        }
        break;

      case BRUSH_TYPES.WATERCOLOR:
        // Sulu boya efekti - akışkan ve dağınık
        const waterSteps = Math.max(4, Math.floor(distance * 4));
        for (let i = 0; i < waterSteps; i++) {
          const t = i / waterSteps;
          const currentX = lastPoint.x + dx * t;
          const currentY = lastPoint.y + dy * t;
          // Daha fazla akışkanlık için çoklu noktalar
          for (let j = 0; j < 3; j++) {
            const offsetX = (Math.random() - 0.5) * brushSizeRef.current * 1.0;
            const offsetY = (Math.random() - 0.5) * brushSizeRef.current * 1.0;
            currentPathRef.current += ` L ${currentX + offsetX} ${currentY + offsetY}`;
          }
        }
        break;

      case BRUSH_TYPES.CRAYON:
        // Pastel boya efekti - mumsu ve pürüzlü
        const crayonSteps = Math.max(4, Math.floor(distance * 4));
        for (let i = 0; i < crayonSteps; i++) {
          const t = i / crayonSteps;
          const currentX = lastPoint.x + dx * t;
          const currentY = lastPoint.y + dy * t;
          // Pastel boya dokusu
          const offsetX = (Math.random() - 0.5) * brushSizeRef.current * 0.5;
          const offsetY = (Math.random() - 0.5) * brushSizeRef.current * 0.5;
          // Dalgalı çizgiler için sinüs fonksiyonu
          const waveX = Math.sin(t * Math.PI * 6) * brushSizeRef.current * 0.15;
          const waveY = Math.cos(t * Math.PI * 6) * brushSizeRef.current * 0.15;
          currentPathRef.current += ` L ${currentX + offsetX + waveX} ${currentY + offsetY + waveY}`;
        }
        break;

      case BRUSH_TYPES.HIGHLIGHTER:
        // Fosforlu kalem efekti - düz ve kalın
        const highlighterWidth = brushSizeRef.current * 1.5; // Daha kalın
        currentPathRef.current += ` L ${x} ${y}`;
        break;
      
      case BRUSH_TYPES.RAINBOW:
        // Gökkuşağı efekti - renkli
        const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        const colorIndex = Math.floor(Math.random() * rainbowColors.length);
        const rainbowSteps = Math.max(3, Math.floor(distance * 3));
        for (let i = 0; i < rainbowSteps; i++) {
          const t = i / rainbowSteps;
          const currentX = lastPoint.x + dx * t;
          const currentY = lastPoint.y + dy * t;
          // Her noktada farklı renk
          currentPathRef.current += ` L ${currentX} ${currentY}`;
        }
        break;

      case BRUSH_TYPES.ROLLER:
        // Roller effect: apply repeating pattern offset along path
        const rollerSteps = Math.max(2, Math.floor(distance * 2));
        for (let i = 0; i <= rollerSteps; i++) {
          const t = i / rollerSteps;
          const cx = lastPoint.x + dx * t;
          const cy = lastPoint.y + dy * t;
          // Pattern: small dashes
          const dashLength = brushSizeRef.current * 1;
          const theta = Math.atan2(dy, dx);
          const offsetX = Math.cos(theta) * dashLength;
          const offsetY = Math.sin(theta) * dashLength;
          if (i % 2 === 0) {
            currentPathRef.current += ` L ${cx - offsetX/2} ${cy - offsetY/2}`;
            currentPathRef.current += ` L ${cx + offsetX/2} ${cy + offsetY/2}`;
          } else {
            // skip segment for roller gap
            currentPathRef.current += ` M ${cx + offsetX/2} ${cy + offsetY/2}`;
          }
        }
        break;

      default:
        // Normal brush - straight line
        currentPathRef.current += ` L ${x} ${y}`;
    }

    lastPointRef.current = { x, y };
    lastTimeRef.current = currentTime;
    return currentPathRef.current;
  }, []);

  const endDrawing = useCallback(() => {
    isDrawingRef.current = false;
    const path = currentPathRef.current;
    currentPathRef.current = '';
    return path;
  }, []);

  const changeBrushSize = useCallback((size) => {
    brushSizeRef.current = size;
  }, []);

  const changeBrushType = useCallback((type) => {
    brushTypeRef.current = type;
  }, []);
  
  const changeColor = useCallback((color) => {
    console.log("useBrush changeColor to:", color);
    currentColorRef.current = color;
  }, []);
  
  return {
    startDrawing,
    continueDrawing,
    endDrawing,
    changeBrushSize,
    changeBrushType,
    changeColor,
    brushType: brushTypeRef.current,
    currentColor: currentColorRef.current
  };
};