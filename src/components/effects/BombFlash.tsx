import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BombFlashProps {
  onDone?: () => void;
}

export const BombFlash: React.FC<BombFlashProps> = ({ onDone }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(0.6, { duration: 100 }),
      withTiming(0.9, { duration: 100 }),
      withTiming(0, { duration: 400 }, () => {
        if (onDone) runOnJS(onDone)();
      })
    );
    translateX.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, []);

  const flashStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      <Animated.View style={[styles.flash, flashStyle]} pointerEvents="none">
        <Text style={styles.nuke}>☢️</Text>
      </Animated.View>
      {/* Shake wrapper — use in parent via ref if needed */}
    </>
  );
};

const styles = StyleSheet.create({
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#FF8C00',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nuke: {
    fontSize: 80,
  },
});
