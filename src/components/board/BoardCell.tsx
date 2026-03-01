import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CELL_SIZE } from '../../constants/layout';
import { BOARD_COLORS, PLAYER_COLORS, SPECIAL_COLORS } from '../../constants/colors';
import { SpecialSquare } from '../../types/game';
import { SPECIAL_ICONS } from '../../constants/specialSquares';
import { SAFE_INDICES, HOME_COLUMNS, HOME_CIRCLES } from '../../constants/board';
import { PlayerColor } from '../../types/game';

interface BoardCellProps {
  row: number;
  col: number;
  specialSquare?: SpecialSquare;
}

function getCellStyle(row: number, col: number) {
  // Home areas (6×6 corners)
  if (row <= 5 && col <= 5) return { bg: BOARD_COLORS.blueHome, isHome: true };
  if (row <= 5 && col >= 9) return { bg: BOARD_COLORS.redHome, isHome: true };
  if (row >= 9 && col >= 9) return { bg: BOARD_COLORS.greenHome, isHome: true };
  if (row >= 9 && col <= 5) return { bg: BOARD_COLORS.yellowHome, isHome: true };

  // Center 3×3
  if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
    return { bg: BOARD_COLORS.centerArea, isCenter: true };
  }

  // Home columns
  const homeColumnCells: Record<PlayerColor, [number, number][]> = {
    blue: [[7,1],[7,2],[7,3],[7,4],[7,5]],
    red: [[1,7],[2,7],[3,7],[4,7],[5,7]],
    green: [[7,13],[7,12],[7,11],[7,10],[7,9]],
    yellow: [[13,7],[12,7],[11,7],[10,7],[9,7]],
  };

  for (const [color, coords] of Object.entries(homeColumnCells) as [PlayerColor, [number,number][]][]) {
    if (coords.some(([r, c]) => r === row && c === col)) {
      return { bg: PLAYER_COLORS[color].light, isHomeCol: true, color };
    }
  }

  return { bg: BOARD_COLORS.cellDefault };
}

export const BoardCell: React.FC<BoardCellProps> = ({ row, col, specialSquare }) => {
  const style = getCellStyle(row, col);

  // Check if this is a safe square on the main track
  const isOnMainTrack =
    (row === 6 || row === 8) && col >= 0 && col <= 14 ||
    (col === 6 || col === 8) && row >= 0 && row <= 14;

  return (
    <View
      style={[
        styles.cell,
        { backgroundColor: style.bg },
        specialSquare && styles.specialCell,
      ]}
    >
      {specialSquare && (
        <Text style={[styles.specialIcon, { fontSize: CELL_SIZE * 0.45 }]}>
          {SPECIAL_ICONS[specialSquare.type]}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: BOARD_COLORS.cellBorder,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  specialCell: {
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  specialIcon: {
    lineHeight: CELL_SIZE,
  },
});
