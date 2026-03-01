import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { BubbleButton } from '../src/components/ui/BubbleButton';
import { UI_COLORS, PLAYER_COLORS } from '../src/constants/colors';
import { PlayerColor } from '../src/types/game';

const ALL_COLORS: PlayerColor[] = ['blue', 'red', 'green', 'yellow'];

export default function SetupScreen() {
  const initGame = useGameStore(s => s.initGame);
  const [playerCount, setPlayerCount] = useState(2);

  const usedColors = ALL_COLORS.slice(0, playerCount);

  const handleStart = () => {
    initGame(playerCount, usedColors);
    router.replace('/game');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎲 Game Setup</Text>

        {/* Player count */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of Players</Text>
          <View style={styles.countRow}>
            {[2, 3, 4].map(n => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.countBtn,
                  playerCount === n && styles.countBtnActive,
                ]}
                onPress={() => setPlayerCount(n)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.countBtnText,
                  playerCount === n && styles.countBtnTextActive,
                ]}>
                  {n} {n === 2 ? '👥' : n === 3 ? '👥👤' : '👥👥'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Players</Text>
          <View style={styles.colorRow}>
            {usedColors.map((color, i) => (
              <View key={color} style={styles.playerChip}>
                <View style={[styles.colorDot, { backgroundColor: PLAYER_COLORS[color].primary }]} />
                <Text style={styles.playerChipText}>P{i + 1} — {color.charAt(0).toUpperCase() + color.slice(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Special squares legend */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Special Squares in This Game</Text>
          <View style={styles.legendGrid}>
            {[
              ['🎲', 'Box 67', '1 — shuffles everyone'],
              ['💣', 'Mine', '4 — sends you home'],
              ['🔒', 'Prison', '2 — 3 turns stuck'],
              ['☢️', 'Nuke', '1 — everyone goes home'],
              ['🔫', 'Gun', '2 — eliminate a piece'],
              ['⭐', '+1 Turn', '2 — roll again'],
              ['🌀', 'Portal', '4 — random teleport'],
              ['❤️', 'Heart', '3 — rescue from home'],
            ].map(([icon, name, desc]) => (
              <View key={name} style={styles.legendItem}>
                <Text style={styles.legendIcon}>{icon}</Text>
                <View>
                  <Text style={styles.legendName}>{name}</Text>
                  <Text style={styles.legendDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <BubbleButton
          label="Start Game!"
          emoji="🚀"
          onPress={handleStart}
          color="#E94560"
          borderColor="#B91C4A"
          style={styles.startBtn}
        />

        <BubbleButton
          label="Back"
          onPress={() => router.back()}
          color="#0F3460"
          borderColor="#1D4ED8"
          style={{ marginBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UI_COLORS.background },
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 14,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  countRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  countBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  countBtnActive: {
    borderColor: '#E94560',
    backgroundColor: 'rgba(233,69,96,0.2)',
  },
  countBtnText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  countBtnTextActive: {
    color: '#FFFFFF',
  },
  colorRow: {
    gap: 10,
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playerChipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  legendGrid: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  legendName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  legendDesc: {
    color: '#64748B',
    fontSize: 12,
  },
  startBtn: {
    width: '100%',
  },
});
