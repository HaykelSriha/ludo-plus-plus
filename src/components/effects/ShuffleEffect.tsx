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

interface ShuffleEffectProps {
  onDone?: () => void;
}

export const ShuffleEffect: React.FC<ShuffleEffectProps> = ({ onDone }) => {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withTiming(1.3, { duration: 600 }),
      withTiming(0, { duration: 300 }, () => {
        if (onDone) runOnJS(onDone)();
      })
    );
    rotate.value = withSequence(
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Text style={styles.emoji}>🎲</Text>
      <Text style={styles.text}>Box 67!</Text>
      <Text style={styles.sub}>Everyone shuffles!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    backgroundColor: '#5B21B6',
    borderWidth: 3,
    borderColor: '#7C3AED',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
    zIndex: 200,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sub: {
    color: '#DDD6FE',
    fontSize: 14,
    marginTop: 4,
  },
});
