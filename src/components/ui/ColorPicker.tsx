import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayerColor } from '../../types/game';
import { PLAYER_COLORS } from '../../constants/colors';

const COLOR_EMOJIS: Record<PlayerColor, string> = {
  blue: '🔵',
  red: '🔴',
  green: '🟢',
  yellow: '🟡',
};

interface ColorPickerProps {
  selected: PlayerColor;
  available: PlayerColor[];
  onChange: (color: PlayerColor) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selected,
  available,
  onChange,
  label,
}) => {
  const allColors: PlayerColor[] = ['blue', 'red', 'green', 'yellow'];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {allColors.map(color => {
          const isAvailable = available.includes(color) || color === selected;
          const isSelected = color === selected;
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.swatch,
                { backgroundColor: PLAYER_COLORS[color].primary, borderColor: PLAYER_COLORS[color].dark },
                isSelected && styles.selected,
                !isAvailable && styles.unavailable,
              ]}
              onPress={() => isAvailable && onChange(color)}
              disabled={!isAvailable}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{COLOR_EMOJIS[color]}</Text>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selected: {
    borderColor: '#FFFFFF',
    borderWidth: 4,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  unavailable: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 24,
    position: 'absolute',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
