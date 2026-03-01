import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withRepeat,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface PortalSwirlProps {
  x: number;
  y: number;
  onDone?: () => void;
}

export const PortalSwirl: React.FC<PortalSwirlProps> = ({ x, y, onDone }) => {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 600 }),
      withTiming(0, { duration: 300 }, () => {
        if (onDone) runOnJS(onDone)();
      })
    );
    scale.value = withSequence(
      withTiming(1.5, { duration: 400 }),
      withTiming(0, { duration: 300 })
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: 400, easing: Easing.linear }),
      3,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { left: x - 25, top: y - 25 }, style]}>
      <Text style={styles.emoji}>🌀</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 36,
  },
});
