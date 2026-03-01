import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Player, PlayerColor, Piece } from '../../types/game';
import { PLAYER_COLORS } from '../../constants/colors';

interface GunSelectModalProps {
  visible: boolean;
  byColor: PlayerColor;
  players: Player[];
  onSelect: (pieceId: string) => void;
}

export const GunSelectModal: React.FC<GunSelectModalProps> = ({
  visible,
  byColor,
  players,
  onSelect,
}) => {
  const enemies = players.filter(p => p.color !== byColor);

  const getEligiblePieces = (): { piece: Piece; player: Player }[] => {
    const result: { piece: Piece; player: Player }[] = [];
    for (const player of enemies) {
      for (const piece of player.pieces) {
        if (!piece.isFinished && piece.position >= 0 && piece.position < 52) {
          result.push({ piece, player });
        }
      }
    }
    return result;
  };

  const eligible = getEligiblePieces();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🔫 Use the Gun!</Text>
          <Text style={styles.subtitle}>Choose a piece to eliminate:</Text>

          {eligible.length === 0 ? (
            <Text style={styles.noTargets}>No eligible targets!</Text>
          ) : (
            eligible.map(({ piece, player }) => {
              const colors = PLAYER_COLORS[player.color];
              return (
                <TouchableOpacity
                  key={piece.id}
                  style={[styles.target, { borderColor: colors.primary }]}
                  onPress={() => onSelect(piece.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.targetText}>
                    {player.name} — Piece #{piece.index + 1} (pos {piece.position})
                  </Text>
                </TouchableOpacity>
              );
            })
          )}

          {eligible.length === 0 && (
            <TouchableOpacity
              style={[styles.target, styles.skipBtn]}
              onPress={() => onSelect('__skip__')}
            >
              <Text style={styles.targetText}>Skip (no targets)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  skipBtn: {
    borderColor: '#6B7280',
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  targetText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  noTargets: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
  },
});
