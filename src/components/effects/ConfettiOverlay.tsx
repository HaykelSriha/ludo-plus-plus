import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CONFETTI_COUNT = 30;
const EMOJIS = ['🎉', '🎊', '🌟', '✨', '🎈', '🥳', '🏆', '🎆'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const delay = index * 80;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 50, { duration: 2000 + Math.random() * 1000, easing: Easing.linear }),
        -1,
        false
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 800 + Math.random() * 400, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, style]}>
      <Text style={{ fontSize: 24 }}>
        {EMOJIS[index % EMOJIS.length]}
      </Text>
    </Animated.View>
  );
};

export const ConfettiOverlay: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};
