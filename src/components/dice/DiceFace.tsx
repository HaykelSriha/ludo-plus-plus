import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DiceFaceProps {
  value: number;
  size: number;
}

const DOT_POSITIONS: Record<number, { top: number; left: number }[]> = {
  1: [{ top: 0.5, left: 0.5 }],
  2: [{ top: 0.2, left: 0.75 }, { top: 0.8, left: 0.25 }],
  3: [{ top: 0.2, left: 0.75 }, { top: 0.5, left: 0.5 }, { top: 0.8, left: 0.25 }],
  4: [
    { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
    { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
  ],
  5: [
    { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
    { top: 0.5, left: 0.5 },
    { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
  ],
  6: [
    { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
    { top: 0.5, left: 0.25 }, { top: 0.5, left: 0.75 },
    { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
  ],
};

export const DiceFace: React.FC<DiceFaceProps> = ({ value, size }) => {
  const dotSize = size * 0.15;
  const padding = size * 0.1;
  const innerSize = size - padding * 2;

  const dots = DOT_POSITIONS[value] ?? [];

  return (
    <View style={[styles.face, { width: size, height: size, borderRadius: size * 0.15 }]}>
      {dots.map((pos, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              position: 'absolute',
              left: padding + pos.left * innerSize - dotSize / 2,
              top: padding + pos.top * innerSize - dotSize / 2,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  face: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  dot: {
    backgroundColor: '#1F2937',
  },
});
