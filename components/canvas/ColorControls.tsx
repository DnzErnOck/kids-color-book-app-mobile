import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { colorPalette } from '@/utils/svgData';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ColorControlsProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClearCanvas: () => void;
  onSaveCanvas?: () => void;
}

export default function ColorControls({
  currentColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onClearCanvas,
  onSaveCanvas,
}: ColorControlsProps) {
  const brushSizes = [2, 5, 10, 15, 20];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Renk Seçin</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorPalette}>
        {colorPalette.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              currentColor === color && styles.selectedColor,
            ]}
            onPress={() => onColorChange(color)}
          />
        ))}
      </ScrollView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Fırça Boyutu</ThemedText>
      <View style={styles.brushSizes}>
        {brushSizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.brushSizeOption,
              brushSize === size && styles.selectedBrushSize,
            ]}
            onPress={() => onBrushSizeChange(size)}
          >
            <View
              style={[
                styles.brushSizePreview,
                { width: size * 2, height: size * 2, backgroundColor: currentColor },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onClearCanvas}>
          <ThemedText>Temizle</ThemedText>
        </TouchableOpacity>
        {onSaveCanvas && (
          <TouchableOpacity style={styles.button} onPress={onSaveCanvas}>
            <ThemedText>Kaydet</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  colorPalette: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingRight: 5,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333333',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  brushSizes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  brushSizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginRight: 5,
    marginBottom: 5,
  },
  selectedBrushSize: {
    borderWidth: 2,
    borderColor: '#333333',
  },
  brushSizePreview: {
    borderRadius: 50,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 16,
    gap: 10,
  },
  button: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});