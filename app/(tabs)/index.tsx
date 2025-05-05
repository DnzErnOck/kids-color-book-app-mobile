import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ColorControls from '@/components/canvas/ColorControls';
import ColoringCanvas, { ColoringCanvasRef } from '@/components/canvas/ColoringCanvas';
import ShapeSelector from '@/components/canvas/ShapeSelector';
import { ShapeKey, svgShapes } from '@/utils/svgData';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [selectedShape, setSelectedShape] = useState<ShapeKey>('square');

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const canvasRef = useRef<ColoringCanvasRef>(null);

  const handleClearCanvas = () => {
    if (canvasRef.current && canvasRef.current.clearCanvas) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSaveCanvas = () => {
    if (canvasRef.current && canvasRef.current.saveCanvas) {
      canvasRef.current.saveCanvas();
    }
  };

  const handleSelectShape = (shape: ShapeKey) => {
    setSelectedShape(shape);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Color World</ThemedText>
        <ThemedText>Boyama dünyasına hoş geldiniz!</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.selectorContainer}>
          <ShapeSelector
            selectedShape={selectedShape}
            onSelectShape={handleSelectShape}
          />
        </ThemedView>
        
        <ThemedView style={styles.canvasContainer}>
          <ColoringCanvas 
            ref={canvasRef}
            svgData={svgShapes[selectedShape]} 
            initialColor={currentColor}
            brushSize={brushSize}
            selectedShape={selectedShape}
          />
        </ThemedView>
        
        <View style={styles.controlsContainer}>
          <ColorControls 
            currentColor={currentColor}
            onColorChange={handleColorChange}
            brushSize={brushSize}
            onBrushSizeChange={handleBrushSizeChange}
            onClearCanvas={handleClearCanvas}
            onSaveCanvas={handleSaveCanvas}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  selectorContainer: {
    width: '15%',
    height: '100%',
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  canvasContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    width: '25%', // Genişlik artırıldı
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#EEEEEE',
    padding: 8,
  },
});
