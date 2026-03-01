import { useEffect } from 'react';
import {
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

export function useDiceAnimation(rollCount: number, isRolling: boolean) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!isRolling) return;

    // Spin animation
    rotateX.value = withSequence(
      withTiming(360 * 3, { duration: 600, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 0 })
    );
    rotateY.value = withSequence(
      withTiming(360 * 2, { duration: 600, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 0 })
    );

    // Bounce up then land
    translateY.value = withSequence(
      withTiming(-20, { duration: 200 }),
      withTiming(0, { duration: 100 }),
      withSpring(0, { damping: 8, stiffness: 200 })
    );

    // Scale pulse
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
  }, [rollCount]);

  return { rotateX, rotateY, scale, translateY };
}
