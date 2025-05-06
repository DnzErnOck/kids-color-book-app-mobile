import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { svgShapes } from '@/utils/svgData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ShapeKey } from '@/utils/svgData';

interface ShapeSelectorProps {
  selectedShape: ShapeKey;
  onSelectShape: (shape: ShapeKey) => void;
}

export default function ShapeSelector({ selectedShape, onSelectShape }: ShapeSelectorProps) {
  // Şekil seçildiğinde animasyon efekti için
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleShapeSelect = (shape: ShapeKey) => {
    // Seçim animasyonu
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    onSelectShape(shape);
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        <Ionicons name="brush" size={18} color="#FF6B6B" />
      </ThemedText>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.shapesContainer}>
        {Object.entries(svgShapes).map(([key, svg]) => (
          <Animated.View 
            key={key}
            style={[{ transform: [{ scale: selectedShape === key ? scaleAnim : 1 }] }]}
          >
            <TouchableOpacity
              style={[
                styles.shapeOption,
                selectedShape === key && styles.selectedShape,
              ]}
              onPress={() => handleShapeSelect(key as ShapeKey)}
            >
              <View style={styles.shapePreview}>
                <SvgXml xml={svg} width="35" height="35" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#FFF8E1', // Çocuklar için sıcak, açık bir arka plan rengi
    borderRadius: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B', // Çocuklar için canlı başlık rengi
    textAlign: 'center',
    marginBottom: 8,
  },
  shapesContainer: {
    flexDirection: 'column',
    marginVertical: 5,
  },
  shapeOption: {
    width: '100%',
    height: 50,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700', // Altın rengi sınır
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedShape: {
    borderWidth: 3,
    borderColor: '#FF6B6B', // Canlı kırmızı sınır
    backgroundColor: '#FFF9F9', // Hafif pembe arka plan
  },
  shapePreview: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 3,
  },
});