import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface RollButtonProps {
  onPress: () => void;
  disabled: boolean;
  color?: string;
  borderColor?: string;
}

export const RollButton: React.FC<RollButtonProps> = ({ onPress, disabled, color = '#E94560', borderColor = '#B91C4A' }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    onPress();
    try {
      scale.value = withSequence(
        withTiming(0.9, { duration: 80 }),
        withSpring(1.1, { damping: 5, stiffness: 300 }),
        withSpring(1.0, { damping: 10 })
      );
    } catch {
      // Animation may fail on web in some configurations
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: color, borderColor, shadowColor: color },
          disabled && styles.disabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>{disabled ? 'Rolling…' : '🎲 Roll!'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E94560',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#B91C4A',
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  disabled: {
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
    shadowOpacity: 0,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
