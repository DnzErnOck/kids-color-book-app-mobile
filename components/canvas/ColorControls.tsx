import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BRUSH_TYPES } from '@/hooks/useBrush';
import { colorPalette } from '@/utils/svgData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ColorControlsProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClearCanvas: () => void;
  onSaveCanvas?: () => void;
  brushType?: typeof BRUSH_TYPES[keyof typeof BRUSH_TYPES];
  onBrushTypeChange?: (type: typeof BRUSH_TYPES[keyof typeof BRUSH_TYPES]) => void;
}

export default function ColorControls({
  currentColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onClearCanvas,
  onSaveCanvas,
  brushType = BRUSH_TYPES.NORMAL,
  onBrushTypeChange = () => {},
}: ColorControlsProps) {
  const brushSizes = [2, 5, 10, 15, 20];
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  const brushTypes = [
    { type: BRUSH_TYPES.NORMAL, name: 'Fırça', icon: 'brush' },
    { type: BRUSH_TYPES.PENCIL, name: 'Kalem', icon: 'pencil' },
    { type: BRUSH_TYPES.CHALK, name: 'Tebeşir', icon: 'color-wand' },
    { type: BRUSH_TYPES.SPRAY, name: 'Sprey', icon: 'water' },
    { type: BRUSH_TYPES.RAINBOW, name: 'Gökkuşağı', icon: 'rainbow' },
    { type: BRUSH_TYPES.WATERCOLOR, name: 'Suluboya', icon: 'color-palette' },
  ];

  // AnimatedButton: animasyonlu buton için küçük bir bileşen
  const AnimatedButton = ({
    children,
    onPress,
    style,
    selected = false,
    selectedScale = 1.13,
    defaultScale = 1,
  }: {
    children: React.ReactNode;
    onPress: () => void;
    style?: any;
    selected?: boolean;
    selectedScale?: number;
    defaultScale?: number;
  }) => {
    const scale = React.useRef(new Animated.Value(selected ? selectedScale : defaultScale)).current;
    React.useEffect(() => {
      Animated.spring(scale, { toValue: selected ? selectedScale : defaultScale, useNativeDriver: true }).start();
    }, [selected, selectedScale, defaultScale]);
    return (
      <AnimatedTouchable
        style={[style, { transform: [{ scale }] }]}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: selectedScale + 0.05, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: selected ? selectedScale : defaultScale, useNativeDriver: true }).start()}
        activeOpacity={0.8}
      >
        {children}
      </AnimatedTouchable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Renk Seçici */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.title}>
            <Ionicons name="color-palette" size={20} color="#FF6B6B" />
          </ThemedText>
          <View style={styles.colorPalette}>
            {colorPalette.map((color) => (
              <AnimatedButton
                key={color}
                onPress={() => onColorChange(color)}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  currentColor === color && styles.selectedColor,
                ]}
                selected={currentColor === color}
                selectedScale={1.15}
                defaultScale={1}
              >
                <View style={{ width: '100%', height: '100%' }} />
              </AnimatedButton>
            ))}
          </View>
        </View>

        {/* Fırça Tipi */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Fırça Tipi</ThemedText>
          <View style={styles.brushTypesContainer}>
            {brushTypes.map((item) => (
              <View key={item.type} style={{ alignItems: 'center', marginBottom: 10 }}>
                <AnimatedButton
                  onPress={() => onBrushTypeChange(item.type)}
                  style={[
                    styles.brushTypeOption,
                    brushType === item.type && styles.selectedBrushType,
                    { backgroundColor: brushType === item.type ? '#FFF176' : '#FFF' },
                  ]}
                  selected={brushType === item.type}
                  selectedScale={1.13}
                  defaultScale={1}
                >
                  <Ionicons name={item.icon as any} size={28} color={brushType === item.type ? '#FF6B6B' : '#333'} />
                </AnimatedButton>
                <Text style={styles.brushTypeName}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Fırça Boyutu */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Fırça Boyutu</ThemedText>
          <View style={styles.brushSizes}>
            {brushSizes.map((size) => (
              <AnimatedButton
                key={size}
                onPress={() => onBrushSizeChange(size)}
                style={[
                  styles.brushSizeOption,
                  brushSize === size && styles.selectedBrushSize,
                ]}
                selected={brushSize === size}
                selectedScale={1.18}
                defaultScale={1}
              >
                <View
                  style={[
                    styles.brushSizePreview,
                    { width: size * 2.2, height: size * 2.2, backgroundColor: currentColor },
                  ]}
                />
              </AnimatedButton>
            ))}
          </View>
        </View>

        {/* Butonlar */}
        <View style={styles.actions}>
          {[{icon: 'trash-outline', label: 'Temizle', onPress: onClearCanvas, color: '#FF6B6B'},
            {icon: 'save-outline', label: 'Kaydet', onPress: onSaveCanvas, color: '#7ED957'}]
            .filter(btn => typeof btn.onPress === 'function')
            .map(btn => (
              <View key={btn.icon} style={{ alignItems: 'center', marginBottom: 8 }}>
                <AnimatedButton
                  onPress={btn.onPress as () => void}
                  style={[
                    styles.actionButton,
                    { backgroundColor: btn.color },
                  ]}
                  selected={false}
                  selectedScale={1.13}
                  defaultScale={1}
                >
                  <Ionicons name={btn.icon as any} size={28} color="#fff" />
                </AnimatedButton>
                <Text style={styles.actionLabel}>{btn.label}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Ekran boyutlarını al
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375; // Küçük ekranlı telefonlar için

const styles = StyleSheet.create({
  container: {
    padding: isSmallScreen ? 4 : 8,
    flex: 1,
    backgroundColor: '#E3F2FD', // Daha pastel mavi panel
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: '100%',
    maxHeight: isSmallScreen ? '100%' : '40%',
  },
  scrollContent: {
    paddingBottom: isSmallScreen ? 5 : 10,
  },
  section: {
    marginBottom: isSmallScreen ? 6 : 10,
  },
  title: {
    fontSize: isSmallScreen ? 13 : 16,
    fontWeight: 'bold',
    color: '#FF6B6B', // Çocuklar için canlı başlık rengi
    textAlign: 'center',
    marginBottom: isSmallScreen ? 3 : 5,
  },
  colorPalette: {
    flexDirection: 'column',
    paddingVertical: isSmallScreen ? 2 : 4,
    alignItems: 'center',
    gap: 8,
  },
  colorOption: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: 24,
    marginVertical: isSmallScreen ? 3 : 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    transform: [{ scale: 1.15 }],
  },
  sectionTitle: {
    marginBottom: isSmallScreen ? 3 : 5,
    fontSize: isSmallScreen ? 13 : 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  brushTypesContainer: {
    flexDirection: 'column',
    paddingVertical: isSmallScreen ? 2 : 4,
    alignItems: 'center',
    gap: 8,
  },
  brushTypeOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedBrushType: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF176',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.25,
    transform: [{ scale: 1.13 }],
  },
  brushTypeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 2,
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.5,
  },
  brushSizes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  brushSizeOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedBrushSize: {
    borderColor: '#7ED957',
    backgroundColor: '#E0F7FA',
    shadowColor: '#7ED957',
    shadowOpacity: 0.22,
    transform: [{ scale: 1.18 }],
  },
  brushSizePreview: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 2,
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.5,
  },
});