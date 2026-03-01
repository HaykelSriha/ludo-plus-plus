import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../../types/game';
import { PLAYER_COLORS } from '../../constants/colors';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  const colors = PLAYER_COLORS[player.color];

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.primary },
        isActive && { backgroundColor: colors.primary + '22' },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.score}>{player.piecesFinished}/4 🏁</Text>
      <Text style={styles.kills}>⚔️{player.kills}</Text>
      <Text style={styles.deaths}>💀{player.deaths}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  score: {
    color: '#94A3B8',
    fontSize: 12,
  },
  kills: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '600',
  },
  deaths: {
    color: '#6B7280',
    fontSize: 12,
  },
});
