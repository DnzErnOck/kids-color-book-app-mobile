import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STICKERS = [
  { id: 'heart', emoji: '❤️' },
  { id: 'star', emoji: '⭐' },
  { id: 'rainbow', emoji: '🌈' },
  { id: 'unicorn', emoji: '🦄' },
  { id: 'sparkles', emoji: '✨' },
  { id: 'butterfly', emoji: '🦋' },
  { id: 'flower', emoji: '🌸' },
  { id: 'balloon', emoji: '🎈' },
  { id: 'sun', emoji: '☀️' },
  { id: 'moon', emoji: '🌙' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
  { id: 'bee', emoji: '🐝' },
  { id: 'ladybug', emoji: '🐞' },
];

interface StickerPickerProps {
  selectedSticker: string | null;
  onSelectSticker: (stickerId: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ 
  selectedSticker, 
  onSelectSticker 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çıkartmalar</Text>
      <ScrollView contentContainerStyle={styles.stickerGrid}>
        {STICKERS.map((sticker) => (
          <TouchableOpacity
            key={sticker.id}
            style={[
              styles.stickerButton,
              selectedSticker === sticker.id && styles.selectedSticker
            ]}
            onPress={() => onSelectSticker(sticker.id)}
          >
            <Text style={styles.stickerEmoji}>{sticker.emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#FF5252',
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stickerButton: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedSticker: {
    borderColor: '#FF5252',
    backgroundColor: '#FFECB3',
  },
  stickerEmoji: {
    fontSize: 24,
  },
});

export default StickerPicker; 