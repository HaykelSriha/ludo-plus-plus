import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { DiceFace } from './DiceFace';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  rollCount: number;
  size?: number;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling, rollCount, size = 72 }) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (!isRolling) return;

    rotateX.value = withSequence(
      withTiming(720, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 0 })
    );
    rotateY.value = withSequence(
      withTiming(540, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 0 })
    );
    translateY.value = withSequence(
      withTiming(-30, { duration: 200 }),
      withTiming(0, { duration: 100 }),
      withSpring(0, { damping: 8, stiffness: 250 })
    );
    scale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
  }, [rollCount]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <DiceFace value={value ?? 1} size={size} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
