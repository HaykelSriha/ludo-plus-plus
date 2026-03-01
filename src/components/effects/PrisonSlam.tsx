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

interface PrisonSlamProps {
  onDone?: () => void;
}

export const PrisonSlam: React.FC<PrisonSlamProps> = ({ onDone }) => {
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 100 });
    translateY.value = withSequence(
      withSpring(0, { damping: 8, stiffness: 300 }),
      withTiming(0, { duration: 800 }),
      withTiming(-200, { duration: 300 }, () => {
        if (onDone) runOnJS(onDone)();
      })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Text style={styles.text}>🔒 PRISON!</Text>
      <Text style={styles.sub}>Stuck for 3 turns!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 3,
    borderColor: '#6B7280',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    zIndex: 200,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
});
