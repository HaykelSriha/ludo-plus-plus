import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BubbleButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  borderColor?: string;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  emoji?: string;
}

export const BubbleButton: React.FC<BubbleButtonProps> = ({
  label,
  onPress,
  color = '#E94560',
  borderColor = '#B91C4A',
  textColor = '#FFFFFF',
  disabled = false,
  style,
  textStyle,
  emoji,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: disabled ? '#6B7280' : color, borderColor: disabled ? '#4B5563' : borderColor },
        pressed && { opacity: 0.75 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, { color: textColor }, textStyle]}>
        {emoji ? `${emoji} ${label}` : label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
