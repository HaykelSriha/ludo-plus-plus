import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, LayoutChangeEvent
} from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { Board } from '../src/components/board/Board';
import { Dice } from '../src/components/dice/Dice';
import { TurnIndicator } from '../src/components/hud/TurnIndicator';
import { BubbleButton } from '../src/components/ui/BubbleButton';
import { BombFlash } from '../src/components/effects/BombFlash';
import { PrisonSlam } from '../src/components/effects/PrisonSlam';
import { ShuffleEffect } from '../src/components/effects/ShuffleEffect';
import { UI_COLORS, PLAYER_COLORS } from '../src/constants/colors';
import { CELL_SIZE } from '../src/constants/layout';
import { GameEffect, PlayerColor } from '../src/types/game';

const CORNER_BTN_H = 60; // corner roll button height
const CORNER_GAP   = 4;  // gap between corner row and board

const CORNER_COLORS: PlayerColor[] = ['blue', 'red', 'green', 'yellow'];

export default function GameScreen() {
  const {
    players,
    currentPlayerIndex,
    phase,
    dice,
    specialSquares,
    selectablePieceIds,
    effectQueue,
    winner,
    rollDice,
    movePiece,
    selectGunTarget,
  } = useGameStore();

  const [activeEffect, setActiveEffect] = useState<GameEffect | null>(null);
  const [cellSize, setCellSize] = useState(CELL_SIZE);

  // Measure the board area (flex:1 container) and derive the largest square that fits.
  const onBoardAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const availH = height - (CORNER_BTN_H + CORNER_GAP) * 2;
    const dim = Math.max(Math.min(availH, width), 100);
    setCellSize(dim / 15);
  }, []);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (winner) {
      router.replace('/victory');
    }
  }, [winner]);

  useEffect(() => {
    if (phase === 'specialEffect' && effectQueue.length > 0) {
      const effect = effectQueue[0];
      if (['atomicBomb', 'box67', 'prison'].includes(effect.type)) {
        setActiveEffect(effect);
      }
    }
  }, [phase, effectQueue]);

  const handleEffectDone = () => setActiveEffect(null);

  const canRoll = phase === 'idle';
  const isRolling = dice.isRolling;

  // Compute status hint
  const hintText = (() => {
    if (phase === 'rolled' && selectablePieceIds.length > 0) return 'Tap a highlighted piece to move';
    if (phase === 'rolled' && selectablePieceIds.length === 0 && !isRolling) return 'No moves — skipping…';
    if (phase === 'moving') return 'Moving…';
    if (phase === 'specialEffect') return '✨ Special effect!';
    if (phase === 'gunSelect' && selectablePieceIds.length > 0) return '🔫 Tap an enemy piece to eliminate!';
    return '';
  })();

  // Corner roll button — one per player position on the board
  const CornerRollBtn = ({ color }: { color: PlayerColor }) => {
    const player = players.find(p => p.color === color);
    if (!player) return <View style={styles.cornerBtnPlaceholder} />;

    const isActive = canRoll && !isRolling && currentPlayer?.color === color;
    const pColors = PLAYER_COLORS[color];

    return (
      <TouchableOpacity
        onPress={rollDice}
        disabled={!isActive}
        style={[
          styles.cornerBtn,
          {
            backgroundColor: isActive ? pColors.primary : '#1E293B',
            borderColor: isActive ? pColors.dark : '#334155',
          },
        ]}
        activeOpacity={0.7}
      >
        <Text style={styles.cornerBtnEmoji}>🎲</Text>
        <Text style={[styles.cornerBtnLabel, { color: isActive ? '#FFFFFF' : '#475569' }]}>
          Roll
        </Text>
      </TouchableOpacity>
    );
  };

  if (!currentPlayer) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Setting up the board…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header: turn label + quit */}
        <View style={styles.header}>
          <TurnIndicator currentPlayer={currentPlayer} />
          <BubbleButton
            label="Quit"
            onPress={() => {
              Alert.alert('Quit Game', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Quit', style: 'destructive', onPress: () => router.replace('/') },
              ]);
            }}
            color="#1E293B"
            borderColor="#334155"
            textColor="#94A3B8"
            style={styles.quitBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>

        {/* Board area — flex:1 so it fills remaining screen space */}
        <View style={styles.boardArea} onLayout={onBoardAreaLayout}>
          {/* Top row: Blue (left) ↔ Red (right) */}
          <View style={[styles.cornerRow, { width: cellSize * 15 }]}>
            <CornerRollBtn color="blue" />
            {currentPlayer?.color === 'blue' && (
              <Dice value={dice.value} isRolling={dice.isRolling} rollCount={dice.rollCount} size={44} />
            )}
            <View style={{ flex: 1 }} />
            {currentPlayer?.color === 'red' && (
              <Dice value={dice.value} isRolling={dice.isRolling} rollCount={dice.rollCount} size={44} />
            )}
            <CornerRollBtn color="red" />
          </View>

          {/* Board */}
          <View style={styles.boardContainer}>
            <Board
              specialSquares={specialSquares}
              players={players}
              selectablePieceIds={selectablePieceIds}
              phase={phase}
              cellSize={cellSize}
              onPiecePress={(pieceId) => {
                if (phase === 'gunSelect') {
                  selectGunTarget(pieceId);
                } else {
                  movePiece(pieceId);
                }
              }}
            />
          </View>

          {/* Bottom row: Yellow (left) ↔ Green (right) */}
          <View style={[styles.cornerRow, { width: cellSize * 15 }]}>
            <CornerRollBtn color="yellow" />
            {currentPlayer?.color === 'yellow' && (
              <Dice value={dice.value} isRolling={dice.isRolling} rollCount={dice.rollCount} size={44} />
            )}
            <View style={{ flex: 1 }} />
            {currentPlayer?.color === 'green' && (
              <Dice value={dice.value} isRolling={dice.isRolling} rollCount={dice.rollCount} size={44} />
            )}
            <CornerRollBtn color="green" />
          </View>
        </View>

        {/* Status hint */}
        {hintText !== '' && (
          <Text
            style={[
              styles.hint,
              phase === 'gunSelect' && { color: '#EF4444', fontWeight: '700' },
            ]}
          >
            {hintText}
          </Text>
        )}
      </View>

      {/* Effect overlays */}
      {activeEffect?.type === 'atomicBomb' && <BombFlash onDone={handleEffectDone} />}
      {activeEffect?.type === 'box67' && <ShuffleEffect onDone={handleEffectDone} />}
      {activeEffect?.type === 'prison' && <PrisonSlam onDone={handleEffectDone} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UI_COLORS.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 8,
    gap: 6,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    gap: 8,
  },
  quitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cornerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  cornerBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cornerBtnPlaceholder: {
    width: 60,
    height: 60,
  },
  cornerBtnEmoji: {
    fontSize: 22,
  },
  cornerBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hint: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
