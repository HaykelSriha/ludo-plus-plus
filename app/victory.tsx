import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { BubbleButton } from '../src/components/ui/BubbleButton';
import { ConfettiOverlay } from '../src/components/effects/ConfettiOverlay';
import { PLAYER_COLORS, UI_COLORS } from '../src/constants/colors';

export default function VictoryScreen() {
  const winner = useGameStore(s => s.winner);
  const resetGame = useGameStore(s => s.resetGame);

  const scale = useSharedValue(0.3);
  const rotate = useSharedValue(-10);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 5, stiffness: 150 });
    rotate.value = withSequence(
      withTiming(10, { duration: 300 }),
      withSpring(0, { damping: 6 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  if (!winner) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Game Over!</Text>
          <BubbleButton label="Home" onPress={() => { resetGame(); router.replace('/'); }} />
        </View>
      </SafeAreaView>
    );
  }

  const colors = PLAYER_COLORS[winner.color];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.dark }]}>
      <ConfettiOverlay />

      <View style={styles.container}>
        <Animated.View style={animStyle}>
          <Text style={styles.trophy}>🏆</Text>
        </Animated.View>

        <Animated.View style={[styles.winnerCard, { borderColor: colors.primary }, animStyle]}>
          <Text style={styles.winLabel}>WINNER!</Text>
          <Text style={[styles.winnerName, { color: colors.primary }]}>
            {winner.name}
          </Text>
          <Text style={styles.congrats}>All 4 pieces made it home! 🎉</Text>
        </Animated.View>

        <View style={styles.buttons}>
          <BubbleButton
            label="Play Again"
            emoji="🔄"
            onPress={() => {
              resetGame();
              router.replace('/setup');
            }}
            color={colors.primary}
            borderColor={colors.dark}
          />
          <BubbleButton
            label="Home"
            emoji="🏠"
            onPress={() => {
              resetGame();
              router.replace('/');
            }}
            color="#1E293B"
            borderColor="#334155"
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  trophy: {
    fontSize: 96,
    textAlign: 'center',
  },
  winnerCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    borderWidth: 3,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 320,
  },
  winLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 4,
    opacity: 0.8,
  },
  winnerName: {
    fontSize: 44,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  congrats: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
  },
});
