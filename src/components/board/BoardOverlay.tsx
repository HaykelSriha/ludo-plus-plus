import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BOARD_SIZE, CELL_SIZE } from '../../constants/layout';
import { Player, GamePhase, Piece as PieceType } from '../../types/game';
import { Piece } from '../piece/Piece';
import { PieceInHome } from '../piece/PieceInHome';
import { HOME_CIRCLES } from '../../constants/board';
import { toGridCoord } from '../../engine/boardPath';

interface BoardOverlayProps {
  players: Player[];
  selectablePieceIds: string[];
  phase: GamePhase;
  onPiecePress: (pieceId: string) => void;
  cellSize?: number;
}

/** Compute pixel-space offsets for pieces sharing the same cell */
function cellSlotOffset(slot: number, groupSize: number, pieceSize: number): { dx: number; dy: number } {
  if (groupSize === 1) return { dx: 0, dy: 0 };
  const gap = pieceSize * 0.12;
  const total = pieceSize * groupSize + gap * (groupSize - 1);
  const start = -total / 2 + pieceSize / 2;
  // Layout up to 4 pieces in a compact grid
  if (groupSize === 2) {
    return slot === 0
      ? { dx: -(pieceSize / 2 + gap / 2), dy: 0 }
      : { dx:  (pieceSize / 2 + gap / 2), dy: 0 };
  }
  if (groupSize === 3) {
    const offsets = [
      { dx: -(pieceSize / 2 + gap / 2), dy: -(pieceSize * 0.3) },
      { dx:  (pieceSize / 2 + gap / 2), dy: -(pieceSize * 0.3) },
      { dx: 0,                          dy:  (pieceSize * 0.35) },
    ];
    return offsets[slot] ?? { dx: 0, dy: 0 };
  }
  // groupSize 4: 2×2 grid
  const col = slot % 2;
  const row = Math.floor(slot / 2);
  return {
    dx: (col - 0.5) * (pieceSize * 0.55),
    dy: (row - 0.5) * (pieceSize * 0.55),
  };
}

export const BoardOverlay: React.FC<BoardOverlayProps> = ({
  players,
  selectablePieceIds,
  phase,
  onPiecePress,
  cellSize = CELL_SIZE,
}) => {
  const pieceSize = cellSize * 0.7;
  const boardSize = cellSize * 15;
  // Group pieces by their rendered grid coordinate key (for multi-piece display)
  const pieceGroups = useMemo(() => {
    const groups = new Map<string, PieceType[]>();
    for (const player of players) {
      for (const piece of player.pieces) {
        if (piece.position === -1) continue; // Home circle pieces handled separately
        const [row, col] = toGridCoord(piece.position, piece.color, piece.index);
        const key = `${row}-${col}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(piece);
      }
    }
    return groups;
  }, [players]);

  const canPressInPhase = (p: GamePhase) => p === 'rolled' || p === 'gunSelect';

  return (
    <View style={[styles.overlay, { width: boardSize, height: boardSize }]} pointerEvents="box-none">
      {players.flatMap(player =>
        player.pieces.map(piece => {
          const isSelectable = selectablePieceIds.includes(piece.id);
          const canPress = isSelectable && canPressInPhase(phase);

          // Home circle pieces
          if (piece.position === -1) {
            const homeCoord = HOME_CIRCLES[piece.color][piece.index];
            return (
              <PieceInHome
                key={piece.id}
                piece={piece}
                row={homeCoord[0]}
                col={homeCoord[1]}
                isSelectable={isSelectable}
                onPress={canPress ? () => onPiecePress(piece.id) : undefined}
                cellSize={cellSize}
              />
            );
          }

          // Finished pieces: show them at the last home column position
          // (they stay visible in the colored lane near the center)
          const [row, col] = toGridCoord(piece.position, piece.color, piece.index);
          const groupKey = `${row}-${col}`;
          const group = pieceGroups.get(groupKey) ?? [piece];
          const slot = group.findIndex(p => p.id === piece.id);
          const groupSize = group.length;

          // Smaller piece size when sharing a cell
          const scaledSize = groupSize === 1
            ? pieceSize
            : groupSize === 2
              ? pieceSize * 0.65
              : groupSize === 3
                ? pieceSize * 0.58
                : pieceSize * 0.52;

          const offset = cellSlotOffset(slot, groupSize, scaledSize);

          return (
            <Piece
              key={piece.id}
              piece={piece}
              isSelectable={isSelectable}
              isMoving={phase === 'moving'}
              onPress={canPress ? () => onPiecePress(piece.id) : undefined}
              pieceSize={scaledSize}
              cellOffsetX={offset.dx}
              cellOffsetY={offset.dy}
              cellSize={cellSize}
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
