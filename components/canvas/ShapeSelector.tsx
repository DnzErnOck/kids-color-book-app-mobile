import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { svgShapes } from '@/utils/svgData';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ShapeKey } from '@/utils/svgData';

interface ShapeSelectorProps {
  selectedShape: ShapeKey;
  onSelectShape: (shape: ShapeKey) => void;
}

export default function ShapeSelector({ selectedShape, onSelectShape }: ShapeSelectorProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Şekil Seçin</ThemedText>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.shapesContainer}>
        {Object.entries(svgShapes).map(([key, svg]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.shapeOption,
              selectedShape === key && styles.selectedShape,
            ]}
            onPress={() => onSelectShape(key as ShapeKey)}
          >
            <View style={styles.shapePreview}>
              <SvgXml xml={svg} width="40" height="40" />
            </View>
            <ThemedText style={styles.shapeName}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
  },
  shapesContainer: {
    flexDirection: 'column',
    marginVertical: 8,
    flex: 1,
  },
  shapeOption: {
    width: '100%',
    height: 70,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 6,
    flexDirection: 'row',
  },
  selectedShape: {
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  shapePreview: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shapeName: {
    fontSize: 14,
    textAlign: 'left',
  },
});