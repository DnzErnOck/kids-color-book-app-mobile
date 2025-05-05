import { useBrush } from '@/hooks/useBrush';
import { useCanvas } from '@/hooks/useCanvas';
import { ShapeKey } from '@/utils/svgData';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';

// Path verisi için tip tanımı
interface PathData {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
}

// ColoringCanvas için ref tipi tanımı
export interface ColoringCanvasRef {
  clearCanvas: () => void;
  saveCanvas: () => void;
}

interface ColoringCanvasProps {
  svgData?: string;
  initialColor?: string;
  brushSize?: number;
  selectedShape?: ShapeKey;
}

// Paths state'i için tip tanımı
type PathsState = {
  [key: string]: PathData | string;
}

const ColoringCanvas = forwardRef<ColoringCanvasRef, ColoringCanvasProps>(({ svgData, initialColor = '#FFFFFF', brushSize = 5, selectedShape }: ColoringCanvasProps, ref) => {
  // Ekran boyutlarını al
  const { width, height } = Dimensions.get('window');
  // Çizim alanı boyutları - mobil uyumlu olacak şekilde düzenlendi
  const canvasWidth = width * 0.6; // Ekranın %60'ı çizim alanı
  const canvasHeight = height * 0.8; // Ekranın %80'i yükseklik
  
  const svgRef = useRef<Svg>(null);
  const [paths, setPaths] = useState<PathsState>({});
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>(initialColor);
  
  const { startDrawing, continueDrawing, endDrawing, changeBrushSize } = useBrush();
  const { loadSvgData, savePaths, fillPath, findPathAtPoint } = useCanvas();
  
  useEffect(() => {
    if (svgData) {
      const loadedPaths = loadSvgData(svgData);
      setPaths(loadedPaths);
    }
  }, [svgData]);
  
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
  
  // Canvas'ı temizle
  const clearCanvas = () => {
    setPaths({});
    savePaths({});
  };
  
  // Canvas'ı kaydet
  const saveCanvas = () => {
    savePaths(paths);
  };
  
  useImperativeHandle(ref, () => ({
    clearCanvas,
    saveCanvas
  }));
  
  // SVG koordinat sistemine dönüştürme fonksiyonu - basitleştirildi ve düzeltildi
  const svgCoordinatesFromTouch = (touchX: number, touchY: number) => {
    // Mobil cihazlarda dokunma koordinatlarını doğrudan kullan
    // Bu, daha basit ve güvenilir bir yaklaşım sağlar
    return { x: touchX, y: touchY };
  };
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      
      // Basit fırça ile boyama - içini boyama özelliği kaldırıldı
      // Doğrudan çizim işlemi başlat
      const newPath = startDrawing(locationX, locationY);
      setCurrentPath(newPath);
    },
    onPanResponderMove: (evt) => {
      if (!currentPath) return;
      
      const { locationX, locationY } = evt.nativeEvent;
      // Doğrudan orijinal koordinatları kullan - daha güvenilir
      const updatedPath = continueDrawing(currentPath, locationX, locationY);
      setCurrentPath(updatedPath);
    },
    onPanResponderRelease: () => {
      // Çizim tamamlandığında
      if (currentPath) {
        try {
          // Benzersiz bir ID oluştur
          const pathId = `path-${Date.now()}`;
          
          // Yeni path objesi oluştur
          const newPath: PathData = {
            d: currentPath,
            stroke: currentColor,
            strokeWidth: brushSize,
            fill: 'none'
          };
          
          // Yeni paths objesini oluştur (mevcut paths + yeni path)
          const updatedPaths: PathsState = {
            ...paths,
            [pathId]: newPath
          };
          
          // State'i güncelle
          setPaths(updatedPaths);
          
          // Tüm paths'leri kaydet
          savePaths(updatedPaths);
          
          // Mevcut path'i sıfırla
          setCurrentPath('');
        } catch (error) {
          console.error('Error in release handler:', error);
          // Hata durumunda sadece mevcut path'i sıfırla
          setCurrentPath('');
        }
      }
    }
  });
  
  // Renk değişikliğini takip et
  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };
  
  return (
    <View 
      style={[styles.canvasContainer]} 
      {...panResponder.panHandlers}
    >
        <Svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* SVG şekillerini render et */}
          {Object.entries(paths).map(([id, pathData]) => {
            // SVG elementi mi yoksa çizim path'i mi kontrol et
            if (typeof pathData === 'string') {
              // SVG elementi olduğunda SvgXml kullanarak render et
              if (pathData.startsWith('<')) {
                return <SvgXml key={id} xml={pathData} width="100%" height="100%" />;
              } else {
                // Eski format - string olarak path verisi (geriye dönük uyumluluk için)
                return <Path key={id} d={pathData} fill="none" stroke={currentColor} strokeWidth={brushSize} />;
              }
            } else {
              // Yeni format - obje olarak path verisi
              return (
                <Path 
                  key={id} 
                  d={pathData.d} 
                  fill={pathData.fill || 'none'} 
                  stroke={pathData.stroke} 
                  strokeWidth={pathData.strokeWidth} 
                />
              );
            }
          })}
          
          {/* Şu anda çizilen path'i render et */}
          {currentPath ? (
            <Path d={currentPath} fill="none" stroke={currentColor} strokeWidth={brushSize} />
          ) : null}
        </Svg>
      </View>
  );
});

// Bileşeni export et
export default ColoringCanvas;

const styles = StyleSheet.create({
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    overflow: 'hidden',
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
});