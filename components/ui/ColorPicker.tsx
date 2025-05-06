import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = [
  '#FF5252', '#FFD600', '#69F0AE', '#40C4FF', '#7C4DFF', '#FFAB40',
  '#FF80AB', '#AEEA00', '#00B8D4', '#FF6D00', '#D500F9', '#C51162',
];

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const colorScales = useRef(COLORS.map(() => new Animated.Value(1))).current;

  const animateColorPress = (index: number) => {
    Animated.sequence([
      Animated.spring(colorScales[index], {
        toValue: 1.2,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(colorScales[index], {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir Renk Seç!</Text>
      <View style={styles.grid}>
        {COLORS.map((color, index) => (
          <Animated.View
            key={color}
            style={{
              transform: [{ scale: colorScales[index] }],
              margin: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => {
                animateColorPress(index);
                console.log("ColorPicker: Selected color:", color);
                onSelectColor(color);
              }}
              activeOpacity={0.7}
            />
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
  colorButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColor: {
    borderColor: '#FFD600',
    borderWidth: 4,
    shadowColor: '#FFD600',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
}); 