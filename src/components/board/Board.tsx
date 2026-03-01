import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BOARD_SIZE, CELL_SIZE } from '../../constants/layout';
import { BOARD_COLORS, PLAYER_COLORS } from '../../constants/colors';
import { SpecialSquare, Player, GamePhase } from '../../types/game';
import { BOARD_PATH, SAFE_INDICES, HOME_COLUMNS } from '../../constants/board';
import { CenterTriangle } from './CenterTriangle';
import { BoardOverlay } from './BoardOverlay';

interface BoardProps {
  specialSquares: SpecialSquare[];
  players: Player[];
  selectablePieceIds: string[];
  phase: GamePhase;
  onPiecePress: (pieceId: string) => void;
  cellSize?: number;
}

// Determine what each cell should render
function getCellBackground(row: number, col: number): string {
  // Home areas
  if (row <= 5 && col <= 5) return BOARD_COLORS.blueHome;
  if (row <= 5 && col >= 9) return BOARD_COLORS.redHome;
  if (row >= 9 && col >= 9) return BOARD_COLORS.greenHome;
  if (row >= 9 && col <= 5) return BOARD_COLORS.yellowHome;
  // Center
  if (row >= 6 && row <= 8 && col >= 6 && col <= 8) return 'transparent';
  // Home columns
  if (row === 7 && col >= 1 && col <= 5) return PLAYER_COLORS.blue.light;
  if (col === 7 && row >= 1 && row <= 5) return PLAYER_COLORS.red.light;
  if (row === 7 && col >= 9 && col <= 13) return PLAYER_COLORS.green.light;
  if (col === 7 && row >= 9 && row <= 13) return PLAYER_COLORS.yellow.light;
  return BOARD_COLORS.cellDefault;
}

function isSafeSquare(row: number, col: number): boolean {
  return BOARD_PATH.some(([r, c], idx) => r === row && c === col && SAFE_INDICES.has(idx));
}

function getSpecialAtCell(
  specialSquares: SpecialSquare[],
  row: number,
  col: number
): SpecialSquare | undefined {
  return specialSquares.find(sq => {
    const coord = BOARD_PATH[sq.trackIndex];
    return coord && coord[0] === row && coord[1] === col;
  });
}

const SPECIAL_ICONS: Record<string, string> = {
  box67: '🎲', mine: '💣', prison: '🔒', atomicBomb: '☢️',
  gun: '🔫', plusOneTurn: '⭐', portal: '🌀', heart: '❤️',
};

import { Text } from 'react-native';

export const Board: React.FC<BoardProps> = ({
  specialSquares, players, selectablePieceIds, phase, onPiecePress, cellSize = CELL_SIZE
}) => {
  const bSize = cellSize * 15;
  const grid = useMemo(() => {
    const rows = [];
    for (let r = 0; r < 15; r++) {
      const cols = [];
      for (let c = 0; c < 15; c++) {
        const bg = getCellBackground(r, c);
        const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;
        const special = isCenter ? undefined : getSpecialAtCell(specialSquares, r, c);
        const isSafe = isSafeSquare(r, c);
        cols.push({ r, c, bg, isCenter, special, isSafe });
      }
      rows.push(cols);
    }
    return rows;
  }, [specialSquares]);

  return (
    <View style={[styles.board, { width: bSize, height: bSize }]}>
      {grid.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map(({ r, c, bg, isCenter, special, isSafe }) => {
            if (isCenter && r === 6 && c === 6) {
              return (
                <View key={`${r}-${c}`} style={[styles.centerCell, { width: cellSize, height: cellSize }]}>
                  <View style={styles.centerWrapper}>
                    <CenterTriangle cellSize={cellSize} />
                  </View>
                </View>
              );
            }
            if (isCenter) {
              return (
                <View key={`${r}-${c}`} style={[styles.centerCell, { width: cellSize, height: cellSize }]} />
              );
            }

            return (
              <View
                key={`${r}-${c}`}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize, backgroundColor: bg },
                  isSafe && styles.safeCell,
                  special && styles.specialCell,
                ]}
              >
                {special && (
                  <Text style={{ fontSize: cellSize * 0.5, lineHeight: cellSize * 0.65 }}>
                    {SPECIAL_ICONS[special.type]}
                  </Text>
                )}
                {isSafe && !special && (
                  <Text style={{ fontSize: cellSize * 0.45, lineHeight: cellSize * 0.65 }}>🛡️</Text>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {/* Pieces overlay */}
      <BoardOverlay
        players={players}
        selectablePieceIds={selectablePieceIds}
        phase={phase}
        onPiecePress={onPiecePress}
        cellSize={cellSize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeCell: {
    backgroundColor: '#D1FAE5',
  },
  specialCell: {
    borderColor: '#818CF8',
    borderWidth: 1,
  },
  centerCell: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  centerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
