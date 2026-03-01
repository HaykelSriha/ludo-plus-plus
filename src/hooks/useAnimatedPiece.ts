import { useEffect, useRef } from 'react';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';

export function useAnimatedPiece(isSelected: boolean, isMoving: boolean) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Idle wobble
  useEffect(() => {
    if (isSelected) {
      // Bounce selection indicator
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1.0, { duration: 200 })
        ),
        -1,
        true
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 150 }),
          withTiming(8, { duration: 150 })
        ),
        -1,
        true
      );
    } else if (!isMoving) {
      // Gentle idle wobble
      cancelAnimation(scale);
      cancelAnimation(rotate);
      scale.value = withSpring(1);
      rotate.value = withTiming(0, { duration: 200 });

      rotate.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1200 }),
          withTiming(3, { duration: 1200 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(scale);
      cancelAnimation(rotate);
      rotate.value = withTiming(0, { duration: 100 });
    }
  }, [isSelected, isMoving]);

  const animateCapture = () => {
    scale.value = withSequence(
      withTiming(1.6, { duration: 150 }),
      withTiming(0, { duration: 200 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 200 })
    );
  };

  const animateReturn = () => {
    opacity.value = 0;
    scale.value = 0;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 8 });
    }, 400);
  };

  return { translateX, translateY, scale, rotate, opacity, animateCapture, animateReturn };
}
