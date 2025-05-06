import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface Brush {
  id: string;
  name: string;
  size: number;
  icon: string;
  color: string;
}

const BRUSHES: Brush[] = [
  { id: 'thin', name: 'İnce', size: 2, icon: 'brush', color: '#FF5252' },
  { id: 'medium', name: 'Orta', size: 5, icon: 'brush', color: '#FFD600' },
  { id: 'thick', name: 'Kalın', size: 10, icon: 'brush', color: '#69F0AE' },
  { id: 'spray', name: 'Sprey', size: 15, icon: 'spray', color: '#40C4FF' },
  { id: 'crayon', name: 'Pastel', size: 8, icon: 'pencil', color: '#7C4DFF' },
  { id: 'marker', name: 'Fosforlu', size: 12, icon: 'marker', color: '#FFAB40' },
  { id: 'watercolor', name: 'Sulu Boya', size: 20, icon: 'water', color: '#80DEEA' },
];

interface BrushPickerProps {
  selectedBrush: string;
  onSelectBrush: (brush: string) => void;
}

export default function BrushPicker({ selectedBrush, onSelectBrush }: BrushPickerProps) {
  const brushScales = useRef(BRUSHES.map(() => new Animated.Value(1))).current;

  const animateBrushPress = (index: number) => {
    Animated.sequence([
      Animated.spring(brushScales[index], {
        toValue: 1.2,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(brushScales[index], {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir Fırça Seç!</Text>
      <View style={styles.grid}>
        {BRUSHES.map((brush, index) => (
          <Animated.View
            key={brush.id}
            style={{
              transform: [{ scale: brushScales[index] }],
              margin: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.brushButton,
                selectedBrush === brush.id && styles.selectedBrush,
              ]}
              onPress={() => {
                animateBrushPress(index);
                onSelectBrush(brush.id);
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={brush.icon}
                size={32}
                color={brush.color}
              />
              <Text style={styles.brushName}>{brush.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: width * 0.8,
  },
  brushButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBrush: {
    borderColor: '#FFD600',
    borderWidth: 4,
    shadowColor: '#FFD600',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  brushName: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
}); 