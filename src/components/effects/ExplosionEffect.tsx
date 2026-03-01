import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface ExplosionEffectProps {
  x: number;
  y: number;
  onDone?: () => void;
}

export const ExplosionEffect: React.FC<ExplosionEffectProps> = ({ x, y, onDone }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.5, { damping: 5, stiffness: 300 }),
      withTiming(0, { duration: 300 }, () => {
        if (onDone) runOnJS(onDone)();
      })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 300 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { left: x - 30, top: y - 30 }, style]}>
      <Text style={styles.emoji}>💥</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
});
