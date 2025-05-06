import { BRUSH_TYPES, useBrush } from '@/hooks/useBrush';
import { useCanvas } from '@/hooks/useCanvas';
import { ShapeKey } from '@/utils/svgData';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, SvgXml } from 'react-native-svg';

// Path verisi için tip tanımı
interface PathData {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
  brushType: string;
}

// ColoringCanvas için ref tipi tanımı
export interface ColoringCanvasRef {
  clearCanvas: () => void;
  saveCanvas: () => void;
  undo: () => void;
  redo: () => void;
  setColor: (color: string) => void;
}

interface ColoringCanvasProps {
  svgData?: string;
  initialColor?: string;
  brushSize?: number;
  selectedShape?: ShapeKey;
  brushType?: typeof BRUSH_TYPES[keyof typeof BRUSH_TYPES];
  selectedSticker?: string | null;
  onStickerPlaced?: () => void;
  isContinuous?: boolean;
}

// Paths state'i için tip tanımı
type PathsState = {
  [key: string]: PathData | string;
}

// Sticker verileri
const STICKERS = [
  { id: 'heart', emoji: '❤️' },
  { id: 'star', emoji: '⭐' },
  { id: 'rainbow', emoji: '🌈' },
  { id: 'unicorn', emoji: '🦄' },
  { id: 'sparkles', emoji: '✨' },
  { id: 'butterfly', emoji: '🦋' },
  { id: 'flower', emoji: '🌸' },
  { id: 'balloon', emoji: '🎈' },
  { id: 'sun', emoji: '☀️' },
  { id: 'moon', emoji: '🌙' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
  { id: 'bee', emoji: '🐝' },
  { id: 'ladybug', emoji: '🐞' },
];

const ColoringCanvas = forwardRef<ColoringCanvasRef, ColoringCanvasProps>(({ 
  svgData, 
  initialColor = '#FFFFFF', 
  brushSize = 5, 
  selectedShape, 
  brushType = BRUSH_TYPES.NORMAL, 
  selectedSticker, 
  onStickerPlaced,
  isContinuous = true 
}: ColoringCanvasProps, ref) => {
  // Ekran boyutlarını al
  const { width, height } = Dimensions.get('window');
  // Çizim alanı boyutları - mobil uyumlu olacak şekilde düzenlendi
  const canvasWidth = width * 0.6; // Ekranın %60'ı çizim alanı
  const canvasHeight = height * 0.8; // Ekranın %80'i yükseklik
  
  const svgRef = useRef<Svg>(null);
  const [paths, setPaths] = useState<PathsState>({});
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>(initialColor);
  const [rainbowColorIndex, setRainbowColorIndex] = useState(0);
  const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  
  const { startDrawing, continueDrawing, endDrawing, changeBrushSize, changeBrushType, brushType: currentBrushType } = useBrush();
  const { loadSvgData, savePaths, fillPath, findPathAtPoint } = useCanvas();
  
  const [history, setHistory] = useState<PathsState[]>([]); // Geri al için geçmiş
  const [redoStack, setRedoStack] = useState<PathsState[]>([]); // İleri al için
  
  const [stickers, setStickers] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);
  
  const [canvasLayout, setCanvasLayout] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (svgData) {
      const loadedPaths = loadSvgData(svgData);
      setPaths(loadedPaths);
      
      // SVG verilerinden şeklin sınırlarını belirle
      extractClipPathFromSvg(svgData);
    }
  }, [svgData]);
  
  // SVG verisinden şeklin sınırlarını çıkaran fonksiyon
  const extractClipPathFromSvg = (svgData: string) => {
    try {
      // Path, rect, circle, polygon gibi şekilleri bul
      const pathMatches = svgData.match(/<(path|rect|circle|polygon)[^>]*\/?>/g) || [];
      
      if (pathMatches.length === 0) {
        console.error('No shape elements found in SVG data');
        return;
      }
      
      // Tüm şekilleri birleştirerek bir clip path oluştur
      let clipPath = '';
      
      pathMatches.forEach((pathStr) => {
        // Path elementi için
        const dMatch = pathStr.match(/d="([^"]*)"/); 
        if (dMatch && dMatch[1]) {
          clipPath += dMatch[1] + ' ';
          return;
        }
        
        // Rect elementi için
        const rectMatch = pathStr.match(/<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*\/?>/i);
        if (rectMatch) {
          const [, x, y, width, height] = rectMatch;
          const x1 = parseFloat(x);
          const y1 = parseFloat(y);
          const x2 = x1 + parseFloat(width);
          const y2 = y1 + parseFloat(height);
          
          clipPath += `M${x1},${y1} L${x2},${y1} L${x2},${y2} L${x1},${y2} Z `;
          return;
        }
        
        // Circle elementi için
        const circleMatch = pathStr.match(/<circle[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*r="([^"]*)"[^>]*\/?>/i);
        if (circleMatch) {
          const [, cx, cy, r] = circleMatch;
          const centerX = parseFloat(cx);
          const centerY = parseFloat(cy);
          const radius = parseFloat(r);
          
          // Daireyi 4 bezier eğrisi ile yaklaşık olarak tanımla
          const k = 0.552284749831; // Daire için bezier kontrol noktası katsayısı
          const kRadius = k * radius;
          
          clipPath += `
            M${centerX},${centerY - radius}
            C${centerX + kRadius},${centerY - radius} ${centerX + radius},${centerY - kRadius} ${centerX + radius},${centerY}
            C${centerX + radius},${centerY + kRadius} ${centerX + kRadius},${centerY + radius} ${centerX},${centerY + radius}
            C${centerX - kRadius},${centerY + radius} ${centerX - radius},${centerY + kRadius} ${centerX - radius},${centerY}
            C${centerX - radius},${centerY - kRadius} ${centerX - kRadius},${centerY - radius} ${centerX},${centerY - radius}
            Z
          `.trim().replace(/\n\s+/g, ' ');
          return;
        }
        
        // Polygon elementi için
        const polygonMatch = pathStr.match(/<polygon[^>]*points="([^"]*)"[^>]*\/?>/i);
        if (polygonMatch) {
          const [, pointsStr] = polygonMatch;
          const points = pointsStr.trim().split(/\s+/);
          
          if (points.length >= 2) {
            clipPath += `M${points[0]}`;
            for (let i = 1; i < points.length; i++) {
              clipPath += ` L${points[i]}`;
            }
            clipPath += ` L${points[0]} `;
          }
          return;
        }
      });
      
      setClipPathData(clipPath);
    } catch (error) {
      console.error('Error extracting clip path from SVG:', error);
    }
  };
  
  // SVG verisi değiştiğinde mevcut çizimleri temizle
  useEffect(() => {
    if (svgData && selectedShape) {
      // Yeni şekil seçildiğinde canvas'ı temizle
      setPaths({});
      const loadedPaths = loadSvgData(svgData);
      setPaths(loadedPaths);
      setCurrentPath('');
    }
  }, [selectedShape, svgData]);
  
  useEffect(() => {
    setCurrentColor(initialColor);
  }, [initialColor]);
  
  useEffect(() => {
    changeBrushSize(brushSize);
  }, [brushSize, changeBrushSize]);
  
  useEffect(() => {
    if (brushType) {
      changeBrushType(brushType);
    }
  }, [brushType, changeBrushType]);
  
  // Canvas'ı temizle
  const clearCanvas = () => {
    setPaths({});
    savePaths({});
  };
  
  // Canvas'ı kaydet
  const saveCanvas = () => {
    savePaths(paths);
  };
  
  // Yeni path eklendiğinde geçmişi güncelle
  useEffect(() => {
    if (Object.keys(paths).length > 0) {
      setHistory((prev) => [...prev, paths]);
      setRedoStack([]); // Yeni çizim yapıldığında ileri al stack'i temizlenir
    }
  }, [Object.keys(paths).join(",")]);
  
  // Geri al fonksiyonu
  const undo = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev; // İlk halden geri alınmaz
      const newHistory = [...prev];
      const last = newHistory.pop();
      if (last) setRedoStack((redo) => [...redo, paths]);
      const previous = newHistory[newHistory.length - 1] || {};
      setPaths(previous);
      savePaths(previous);
      return newHistory;
    });
  };
  
  // İleri al fonksiyonu
  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const newRedo = [...prev];
      const next = newRedo.pop();
      if (next) {
        setHistory((hist) => [...hist, next]);
        setPaths(next);
        savePaths(next);
      }
      return newRedo;
    });
  };
  
  useImperativeHandle(ref, () => ({
    clearCanvas,
    saveCanvas,
    undo,
    redo,
    setColor: (color: string) => {
      setCurrentColor(color);
    }
  }));
  
  // SVG koordinat sistemine dönüştürme fonksiyonu - basitleştirildi ve düzeltildi
  const svgCoordinatesFromTouch = (touchX: number, touchY: number) => {
    // Mobil cihazlarda dokunma koordinatlarını doğrudan kullan
    // Bu, daha basit ve güvenilir bir yaklaşım sağlar
    return { x: touchX, y: touchY };
  };
  
  // Şeklin sınırlarını belirlemek için kullanılacak değişkenler
  const [clipPathId] = useState(`clip-path-${Date.now()}`);
  const [clipPathData, setClipPathData] = useState<string>('');
  
  // Gökkuşağı fırçası için renk değiştirme
  useEffect(() => {
    if (currentBrushType === BRUSH_TYPES.RAINBOW) {
      const interval = setInterval(() => {
        setRainbowColorIndex((prevIndex) => (prevIndex + 1) % rainbowColors.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentBrushType]);
  
  // Dokunma noktalarını takip etmek için ref
  const lastTouchRef = useRef({ x: 0, y: 0, timestamp: 0 });
  const isDrawingRef = useRef(false);
  
  // Dokunma hızını hesaplamak için yardımcı fonksiyon
  const calculateTouchVelocity = (x: number, y: number, timestamp: number) => {
    const lastTouch = lastTouchRef.current;
    const timeDiff = timestamp - lastTouch.timestamp;
    if (timeDiff === 0) return 0;
    
    const distance = Math.sqrt(
      Math.pow(x - lastTouch.x, 2) + 
      Math.pow(y - lastTouch.y, 2)
    );
    
    return distance / timeDiff; // piksel/ms cinsinden hız
  };
  
  // Doğrudan renk değiştirme fonksiyonu
  const handleColorChange = (color: string) => {
    console.log("Renk değişti:", color); // Debug
    setCurrentColor(color);
  };
  
  // Renk değişimini izle
  useEffect(() => {
    console.log("initialColor değişti:", initialColor); // Debug
    setCurrentColor(initialColor);
  }, [initialColor]);
  
  // PanResponder oluştur
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const { x, y } = svgCoordinatesFromTouch(locationX, locationY);
        console.log("Çizim başladı, renk:", currentColor); // Debug
        const path = startDrawing(x, y, currentColor);
        setCurrentPath(path);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const { x, y } = svgCoordinatesFromTouch(locationX, locationY);
        const path = continueDrawing(x, y);
        setCurrentPath(path);
      },
      onPanResponderRelease: () => {
        const path = endDrawing();
        if (path) {
          const newPathId = `path-${Date.now()}`;
          // Path, renk, boyut ve tip bilgilerini sakla
          const pathData = {
            d: path,
            stroke: currentColor,
            strokeWidth: brushSize,
            fill: 'none',
            brushType: brushType
          };
          
          console.log("Çizim bitti, kaydedilen renk:", pathData.stroke); // Debug
          
          setPaths(prev => ({
            ...prev,
            [newPathId]: pathData
          }));
          setCurrentPath('');
        }
      },
    })
  ).current;
  
  // Sticker için ayrı bir dokunma yöneticisi
  const stickerTapHandler = (event: any) => {
    if (!selectedSticker) return;
    
    const { locationX, locationY } = event.nativeEvent;
    console.log("Sticker için dokunma:", locationX, locationY); // Debug
    
    const sticker = STICKERS.find(s => s.id === selectedSticker);
    if (sticker) {
      console.log("Sticker bulundu:", sticker.emoji); // Debug
      
      setStickers(prev => [
        ...prev,
        {
          id: `sticker-${Date.now()}`,
          emoji: sticker.emoji,
          x: locationX,
          y: locationY
        }
      ]);
      
      if (onStickerPlaced) {
        onStickerPlaced();
      }
    }
  };
  
  // useEffect ile sticker ekleme logunu kaldır
  useEffect(() => {
    if (selectedSticker) {
      console.log("Sticker seçildi, ekrana dokununca yerleştirilecek:", selectedSticker); // Debug
    }
  }, [selectedSticker]);
  
  return (
    <View 
      style={[styles.canvasContainer, { position: 'relative' }]} 
      {...(selectedSticker ? {} : panResponder.panHandlers)}
      onTouchStart={selectedSticker ? stickerTapHandler : undefined}
      onLayout={e => {
        setCanvasLayout(e.nativeEvent.layout);
      }}
    >
      <Svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        style={{ backgroundColor: '#FFFFFF' }}
        renderToHardwareTextureAndroid={true}
        shouldRasterizeIOS={true}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          {clipPathData && (
            <ClipPath id={clipPathId}>
              <Path d={clipPathData} />
            </ClipPath>
          )}
        </Defs>
        
        {/* Şu anda çizilen path'i render et */}
        {currentPath && (
          <G clipPath={clipPathData ? `url(#${clipPathId})` : undefined}>
            <Path 
              d={currentPath} 
              fill="none" 
              stroke={currentColor} 
              strokeWidth={brushType === BRUSH_TYPES.PENCIL ? brushSize * 1.5 : 
                          brushType === BRUSH_TYPES.CHALK ? brushSize * 1.2 :
                          brushType === BRUSH_TYPES.WATERCOLOR ? brushSize * 1.8 :
                          brushType === BRUSH_TYPES.CRAYON ? brushSize * 1.4 :
                          brushType === BRUSH_TYPES.HIGHLIGHTER ? brushSize * 2 :
                          brushSize}
              strokeOpacity={brushType === BRUSH_TYPES.PENCIL ? 0.6 : 
                           brushType === BRUSH_TYPES.CHALK ? 0.8 :
                           brushType === BRUSH_TYPES.WATERCOLOR ? 0.3 :
                           brushType === BRUSH_TYPES.CRAYON ? 0.7 :
                           brushType === BRUSH_TYPES.HIGHLIGHTER ? 0.4 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        )}

        {/* Kaydedilmiş path'leri render et */}
        {Object.entries(paths).map(([id, pathData]) => {
          if (typeof pathData === 'string') {
            if (pathData.startsWith('<')) {
              return <SvgXml key={id} xml={pathData} width="100%" height="100%" />;
            } else {
              // String tipindeki pathData'yı parçala
              const parts = pathData.split('|');
              const path = parts[0];
              // Eğer renk bilgisi varsa kullan, yoksa mevcut rengi kullan
              const color = parts.length > 1 ? parts[1] : currentColor;
              // Kalınlık bilgisi
              const pathBrushSize = parts.length > 2 ? parseFloat(parts[2]) : brushSize;
              // Fırça tipi bilgisi
              const pathBrushType = parts.length > 3 ? parts[3] : BRUSH_TYPES.NORMAL;
              
              return (
                <G key={id} clipPath={clipPathData ? `url(#${clipPathId})` : undefined}>
                  <Path 
                    d={path} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth={pathBrushSize}
                    strokeOpacity={0.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </G>
              );
            }
          } else {
            // Nesne tipindeki pathData'yı kullan
            return (
              <G key={id} clipPath={clipPathData ? `url(#${clipPathId})` : undefined}>
                <Path 
                  d={pathData.d} 
                  fill={pathData.fill || 'none'} 
                  stroke={pathData.stroke} 
                  strokeWidth={pathData.strokeWidth}
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
            );
          }
        })}
      </Svg>
      
      {/* Sticker'ları render et */}
      {stickers.map(sticker => (
        <View
          key={sticker.id}
          style={{
            position: 'absolute',
            left: sticker.x - 18,
            top: sticker.y - 18,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          pointerEvents="none"
        >
          <Text style={{ fontSize: 32 }}>{sticker.emoji}</Text>
        </View>
      ))}
    </View>
  );
});

// Bileşeni export et
export default ColoringCanvas;

// Ekran boyutlarını al - responsive tasarım için
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375; // Küçük ekranlı telefonlar için

const styles = StyleSheet.create({
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: isSmallScreen ? 1 : 2, // Küçük ekranlarda daha ince kenarlık
    borderColor: '#FFD700', // Altın rengi sınır - çocuklar için daha çekici
    borderRadius: 12, // Yuvarlatılmış köşeler
    overflow: 'hidden',
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: isSmallScreen ? 2 : 5, // Küçük ekranlarda daha az margin
    marginVertical: isSmallScreen ? 2 : 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Android için gölge
  },
});