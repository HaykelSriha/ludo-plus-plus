import { GridCoord, PlayerColor, PiecePosition } from '../types/game';
import { BOARD_PATH, COLOR_OFFSETS, HOME_COLUMNS, HOME_CIRCLES } from '../constants/board';

/** Convert a piece's absolute position to a grid coordinate */
export function toGridCoord(
  position: PiecePosition,
  color: PlayerColor,
  pieceIndex: number
): GridCoord {
  if (position === -1) {
    // In home circle
    return HOME_CIRCLES[color][pieceIndex];
  }
  if (position === 57) {
    // Finished — show inside the center triangle in the color's quadrant
    const centerQuadrant: Record<PlayerColor, GridCoord> = {
      blue:   [7, 6],  // left triangle quadrant
      red:    [6, 7],  // top triangle quadrant
      green:  [7, 8],  // right triangle quadrant
      yellow: [8, 7],  // bottom triangle quadrant
    };
    return centerQuadrant[color];
  }
  if (position >= 52) {
    // Home column (52 = index 0, 56 = index 4)
    return HOME_COLUMNS[color][position - 52];
  }
  // Main track
  return BOARD_PATH[position];
}

/** Convert relative position (0–51) + color to global track index */
export function toGlobalIndex(color: PlayerColor, relativePos: number): number {
  return (COLOR_OFFSETS[color] + relativePos) % 52;
}

/** Convert global track index to relative position for a color */
export function toRelativePos(color: PlayerColor, globalIndex: number): number {
  const offset = COLOR_OFFSETS[color];
  return ((globalIndex - offset) + 52) % 52;
}

/** Get home column coordinates for a color */
export function getHomeColumn(color: PlayerColor): GridCoord[] {
  return HOME_COLUMNS[color];
}

/** Check if two grid coords are the same cell */
export function coordsEqual(a: GridCoord, b: GridCoord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
