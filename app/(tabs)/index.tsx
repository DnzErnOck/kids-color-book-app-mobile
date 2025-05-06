import ColoringCanvas, { ColoringCanvasRef } from '@/components/canvas/ColoringCanvas';
import BrushPicker from '@/components/ui/BrushPicker';
import ColorPicker from '@/components/ui/ColorPicker';
import PatternPicker from '@/components/ui/PatternPicker';
import StickerPicker from '@/components/ui/StickerPicker';
import { BRUSH_TYPES } from '@/hooks/useBrush';
import { ShapeKey, svgShapes } from '@/utils/svgData';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const TOOLBAR_BUTTONS = [
  { key: 'brush', icon: 'brush', color: '#FFD600' },
  { key: 'color', icon: 'palette', color: '#FF5252' },
  { key: 'sticker', icon: 'emoticon-happy', color: '#00C853' },
  { key: 'pattern', icon: 'layers', color: '#8D6E63' },
  { key: 'undo', icon: 'undo', color: '#4FC3F7' },
  { key: 'clear', icon: 'trash-can', color: '#FF6B6B' },
  { key: 'save', icon: 'content-save', color: '#80DEEA' },
];

export default function HomeScreen() {
  const [modal, setModal] = useState<'brush' | 'color' | 'sticker' | 'pattern' | null>(null);
  const [selectedShape] = useState<ShapeKey>('apple');
  const [selectedColor, setSelectedColor] = useState('#FF5252');
  const [selectedBrush, setSelectedBrush] = useState('medium');
  const [brushSize, setBrushSize] = useState(8);
  const [brushType, setBrushType] = useState<typeof BRUSH_TYPES[keyof typeof BRUSH_TYPES]>(BRUSH_TYPES.NORMAL);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string>('dots');
  const canvasRef = useRef<ColoringCanvasRef>(null);

  // Modal animasyonu için örnek state
  const modalAnim = useRef(new Animated.Value(0)).current;
  const openModal = (type: 'brush' | 'color' | 'sticker' | 'pattern') => {
    setModal(type);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModal(null));
  };

  const handleStickerSelect = (stickerId: string) => {
    setSelectedSticker(stickerId);
    // Clear any pattern when entering sticker mode
    setSelectedPattern('');
    canvasRef.current?.setPattern('');
    closeModal();
  };

  const handleColorSelect = (color: string) => {
    console.log("HomeScreen: Color selected:", color);
    setSelectedColor(color);
    if (canvasRef.current) {
      console.log("HomeScreen: Setting color on canvas:", color);
      canvasRef.current.setColor(color);
    }
    closeModal();
  };

  const handleBrushSelect = (brush: string) => {
    // Exit sticker and pattern modes when brushing
    setSelectedSticker(null);
    setSelectedPattern('');
    canvasRef.current?.setPattern('');
    setSelectedBrush(brush);
    switch (brush) {
      case 'thin':
        setBrushSize(2);
        setBrushType(BRUSH_TYPES.NORMAL);
        break;
      case 'medium':
        setBrushSize(5);
        setBrushType(BRUSH_TYPES.NORMAL);
        break;
      case 'thick':
        setBrushSize(10);
        setBrushType(BRUSH_TYPES.NORMAL);
        break;
      case 'spray':
        setBrushSize(15);
        setBrushType(BRUSH_TYPES.PENCIL);
        break;
      case 'crayon':
        setBrushSize(8);
        setBrushType(BRUSH_TYPES.CRAYON);
        break;
      case 'marker':
        setBrushSize(12);
        setBrushType(BRUSH_TYPES.HIGHLIGHTER);
        break;
      case 'watercolor':
        setBrushSize(20);
        setBrushType(BRUSH_TYPES.WATERCOLOR);
        break;
      case 'roller':
        setBrushSize(12);
        setBrushType(BRUSH_TYPES.ROLLER);
        break;
    }
    closeModal();
  };

  // Handle pattern selection, exit sticker mode
  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);
    setSelectedSticker(null);
    canvasRef.current?.setPattern(patternId);
    closeModal();
  };

  // Toolbar işlevleri
  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'brush':
      case 'color':
      case 'sticker':
      case 'pattern':
        openModal(action);
        break;
      case 'undo':
        canvasRef.current?.undo();
        break;
      case 'clear':
        canvasRef.current?.clearCanvas();
        break;
      case 'save':
        canvasRef.current?.saveCanvas();
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFF9C4', '#FFECB3', '#FFE0B2']}
        style={styles.container}
      >
        {/* Ortada büyük, yuvarlak köşeli çizim alanı */}
        <View style={styles.centeredContent}>
          <View style={styles.canvasShadow}>
            <View style={styles.canvasContainer}>
              <ColoringCanvas
                ref={canvasRef}
                svgData={svgShapes[selectedShape]}
                initialColor={selectedColor}
                brushSize={brushSize}
                selectedShape={selectedShape}
                brushType={brushType}
                selectedSticker={selectedSticker}
                pattern={selectedPattern}
              />
            </View>
          </View>
        </View>
        {/* Alt yüzen toolbar */}
        <View style={styles.floatingToolbar}>
          {TOOLBAR_BUTTONS.map(btn => (
            <TouchableOpacity
              key={btn.key}
              style={[styles.toolbarButton, { backgroundColor: btn.color }]}
              onPress={() => handleToolbarAction(btn.key)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name={btn.icon} size={32} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
        {/* Animasyonlu modal altyapısı */}
        <Modal visible={!!modal} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <Animated.View style={[styles.modalContent, {
              opacity: modalAnim,
              transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
            }]}
            >
              {modal === 'brush' && (
                <BrushPicker
                  selectedBrush={selectedBrush}
                  onSelectBrush={handleBrushSelect}
                />
              )}
              {modal === 'color' && (
                <ColorPicker
                  selectedColor={selectedColor}
                  onSelectColor={handleColorSelect}
                />
              )}
              {modal === 'sticker' && (
                <StickerPicker
                  selectedSticker={selectedSticker}
                  onSelectSticker={handleStickerSelect}
                />
              )}
              {modal === 'pattern' && (
                <PatternPicker
                  selectedPattern={selectedPattern}
                  onSelectPattern={handlePatternSelect}
                />
              )}
              <TouchableOpacity style={styles.closeModalBtn} onPress={closeModal}>
                <MaterialCommunityIcons name="close" size={28} color="#FF5252" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasShadow: {
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
    borderRadius: 36,
  },
  canvasContainer: {
    width: width * 0.82,
    height: height * 0.62,
    backgroundColor: '#fff',
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    marginHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
  },
  toolbarButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.7,
    minHeight: 180,
    backgroundColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 18,
  },
  closeModalBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 18,
    padding: 4,
  },
});
