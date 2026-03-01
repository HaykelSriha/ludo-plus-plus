export type PlayerColor = 'blue' | 'red' | 'green' | 'yellow';
export type GridCoord = [row: number, col: number];
// -1 = home circle, 0–51 = main track, 52–56 = home column, 57 = finished
export type PiecePosition = number;

export type SpecialSquareType =
  | 'box67'
  | 'mine'
  | 'prison'
  | 'atomicBomb'
  | 'gun'
  | 'plusOneTurn'
  | 'portal'
  | 'heart';

export type GamePhase =
  | 'idle'
  | 'rolled'
  | 'moving'
  | 'specialEffect'
  | 'gunSelect'
  | 'finished';

export interface Piece {
  id: string; // 'blue-0' … 'yellow-3'
  color: PlayerColor;
  index: number; // 0–3
  position: PiecePosition;
  prisonTurnsLeft: number; // 0=free, 1–3=imprisoned
  isFinished: boolean;
}

export interface SpecialSquare {
  type: SpecialSquareType;
  trackIndex: number; // Global main-track index 0–51
  portalGroupId?: number; // all 4 portals share group 0
}

export interface Player {
  id: string;
  color: PlayerColor;
  name: string;
  pieces: Piece[];
  piecesFinished: number;
  kills: number;   // pieces captured (by stepping on enemy or using gun)
  deaths: number;  // own pieces sent home by enemy
}

export interface DiceState {
  value: number | null;
  isRolling: boolean;
  rollCount: number; // increments each roll → triggers animation
}

export type GameEffect =
  | { type: 'capture'; pieceId: string; byColor: PlayerColor }
  | { type: 'mine'; pieceId: string }
  | { type: 'prison'; pieceId: string }
  | { type: 'atomicBomb' }
  | { type: 'box67' }
  | { type: 'portal'; pieceId: string; toTrackIndex: number }
  | { type: 'gun'; byColor: PlayerColor }
  | { type: 'plusOneTurn' }
  | { type: 'heart'; forColor: PlayerColor }
  | { type: 'win'; winnerColor: PlayerColor };

export interface GameState {
  playerCount: number;
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  dice: DiceState;
  extraTurnsQueued: number;
  specialSquares: SpecialSquare[];
  selectablePieceIds: string[];
  pendingGunSelectBy: PlayerColor | null;
  effectQueue: GameEffect[];
  winner: Player | null;
}
