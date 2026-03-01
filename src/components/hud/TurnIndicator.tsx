import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Player } from '../../types/game';
import { PLAYER_COLORS } from '../../constants/colors';

interface TurnIndicatorProps {
  currentPlayer: Player;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ currentPlayer }) => {
  const colors = PLAYER_COLORS[currentPlayer.color];
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1, { damping: 6, stiffness: 200 }),
      withSpring(1.0, { damping: 10 })
    );
  }, [currentPlayer.id]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.primary, borderColor: colors.dark },
        animStyle,
      ]}
    >
      <Text style={[styles.name, { color: colors.text }]}>
        {currentPlayer.name}'s Turn
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 2,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
