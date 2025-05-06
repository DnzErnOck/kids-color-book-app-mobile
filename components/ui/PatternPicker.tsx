import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Define some pattern dash arrays
export const PATTERNS = [
  { id: 'dots', name: 'Nokta', type: 'dash', dash: [1, 4] },
  { id: 'dashes', name: 'Çizgi', type: 'dash', dash: [6, 4] },
  { id: 'dashdot', name: 'Çizgi-Nokta', type: 'dash', dash: [6, 4, 1, 4] },
  { id: 'long', name: 'Uzun Çizgi', type: 'dash', dash: [12, 6] },
  // Shape patterns
  { id: 'heart', name: 'Kalp', type: 'shape', shape: '❤️' },
  { id: 'star', name: 'Yıldız', type: 'shape', shape: '⭐' },
];

interface PatternPickerProps {
  selectedPattern: string;
  onSelectPattern: (patternId: string) => void;
}

export default function PatternPicker({ selectedPattern, onSelectPattern }: PatternPickerProps) {
  const scales = useRef(PATTERNS.map(() => new Animated.Value(1))).current;
  const animate = (i: number) => {
    Animated.sequence([
      Animated.spring(scales[i], { toValue: 1.2, tension: 50, friction: 3, useNativeDriver: true }),
      Animated.spring(scales[i], { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bir Desen Seç!</Text>
      <View style={styles.grid}>
        {PATTERNS.map((pattern, index) => (
          <Animated.View key={pattern.id} style={{ transform: [{ scale: scales[index] }], margin: 10 }}>
            <TouchableOpacity
              style={[styles.patternButton, selectedPattern === pattern.id && styles.selected]}
              onPress={() => { animate(index); onSelectPattern(pattern.id); }}
              activeOpacity={0.7}
            >
              {pattern.type === 'shape' ? (
                <Text style={styles.emoji}>{pattern.shape}</Text>
              ) : (
                <Svg width={60} height={20} style={styles.svg}>
                  <Path
                    d="M0,10 L60,10"
                    stroke="#333"
                    strokeWidth={4}
                    strokeDasharray={pattern.dash}
                    strokeLinecap="round"
                  />
                </Svg>
              )}
              <Text style={styles.name}>{pattern.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  title: { fontSize: 20, fontWeight: '600', color: '#666', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  patternButton: { alignItems: 'center', },
  svg: { backgroundColor: '#fff', borderRadius: 4 },
  name: { marginTop: 4, fontSize: 12, color: '#444' },
  emoji: { fontSize: 32 },
  selected: { borderColor: '#FFD600', borderWidth: 2, borderRadius: 6 },
}); 