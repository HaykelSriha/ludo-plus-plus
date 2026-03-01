import { GridCoord, PlayerColor } from '../types/game';

export const BOARD_PATH: GridCoord[] = [
  // 0–4: left arm, row 6 rightward (Blue start = 0)
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  // 5–10: top arm, col 6 upward
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  // 11: top safe square
  [0, 7],
  // 12
  [0, 8],
  // 13–17: top arm, col 8 downward (Red start = 13)
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  // 18–23: right arm, row 6 rightward
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  // 24: right safe square
  [7, 14],
  // 25–30: right arm, row 8 leftward (Green start = 26)
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  // 31–36: bottom arm, col 8 downward
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  // 37: bottom safe square
  [14, 7],
  // 38
  [14, 6],
  // 39–43: bottom arm, col 6 upward (Yellow start = 39)
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  // 44–49: left arm, row 8 leftward
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  // 50: left safe square
  [7, 0],
  // 51
  [6, 0],
];

// Color start offsets on main track (piece at relative pos 0 = this global index)
export const COLOR_OFFSETS: Record<PlayerColor, number> = {
  blue: 0,
  red: 13,
  green: 26,
  yellow: 39,
};

// Safe square global indices (the 4 start squares — pieces can't be captured here)
// NOTE: the old "home col entry" safe squares (11,24,37,50) are removed because
// pieces now skip directly into the home column from relative position 50,
// so those squares are no longer special entry points.
export const SAFE_INDICES = new Set([0, 13, 26, 39]);

// Home columns [row, col] × 5 squares (index 0 = first square, 4 = last before center)
export const HOME_COLUMNS: Record<PlayerColor, GridCoord[]> = {
  blue: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  red: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  green: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  yellow: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

// Home area circle positions (4 circles inside each 6×6 corner)
export const HOME_CIRCLES: Record<PlayerColor, GridCoord[]> = {
  blue: [[1, 1], [1, 4], [4, 1], [4, 4]],
  red: [[1, 10], [1, 13], [4, 10], [4, 13]],
  green: [[10, 10], [10, 13], [13, 10], [13, 13]],
  yellow: [[10, 1], [10, 4], [13, 1], [13, 4]],
};

// Center triangle area (3×3 at rows 6–8, cols 6–8)
export const CENTER_COORD: GridCoord = [7, 7];
