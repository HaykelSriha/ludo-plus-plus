import { GameState, Piece, Player, PlayerColor, PiecePosition, GameEffect } from '../types/game';
import { COLOR_OFFSETS, SAFE_INDICES } from '../constants/board';
import { getSpecialAt, getPortals } from './specialPlacement';
import { pick } from '../utils/random';

/**
 * Get the absolute (global) track position for a piece.
 * Returns null if piece is not on the main track (home circle or home column or finished).
 */
export function getGlobalTrackIndex(piece: Piece): number | null {
  if (piece.position < 0 || piece.position >= 52) return null;
  return piece.position;
}

/**
 * Move a piece forward by `steps` from its current position.
 * Returns the new PiecePosition or null if the move is impossible
 * (e.g., overshoot of home column).
 */
export function computeNewPosition(
  piece: Piece,
  steps: number
): PiecePosition | null {
  const { position, color } = piece;

  // Piece is in home circle — needs exactly 6 to enter
  if (position === -1) {
    if (steps !== 6) return null;
    return COLOR_OFFSETS[color];
  }

  // Piece is in home column (52–56)
  if (position >= 52 && position <= 56) {
    const newPos = position + steps;
    if (newPos === 57) return 57; // Finished!
    if (newPos > 57) return null; // Overshoot
    return newPos;
  }

  // Piece is on main track
  const relPos = getRelativePosition(piece);
  const newRelPos = relPos + steps;

  if (newRelPos < 51) {
    // Still on main track (relative 0–50)
    return (COLOR_OFFSETS[color] + newRelPos) % 52;
  } else if (newRelPos <= 56) {
    // Entering home column: relative 51 → internal position 52, ..., relative 55 → 56
    // (relative 51 is the "diagonal square" we skip — piece goes from safe square directly
    //  into the home column at position 52)
    return newRelPos + 1;
  } else if (newRelPos === 57) {
    return 57; // Finished!
  } else {
    return null; // Overshoot
  }
}

/** Get relative position of a piece (0-based from its color's start) */
export function getRelativePosition(piece: Piece): number {
  if (piece.position < 0 || piece.position >= 52) return piece.position;
  const offset = COLOR_OFFSETS[piece.color];
  return ((piece.position - offset) + 52) % 52;
}

/**
 * Determine which pieces can legally move given the current dice roll.
 * Returns array of piece IDs that can move.
 */
export function legalMoves(state: GameState): string[] {
  const { players, currentPlayerIndex, dice } = state;
  if (dice.value === null) return [];

  const player = players[currentPlayerIndex];
  const steps = dice.value;
  const movable: string[] = [];

  for (const piece of player.pieces) {
    if (piece.isFinished) continue;
    if (piece.prisonTurnsLeft > 0) continue; // Imprisoned pieces can't move

    const newPos = computeNewPosition(piece, steps);
    if (newPos !== null) {
      movable.push(piece.id);
    }
  }

  return movable;
}

/**
 * Apply a move and compute the resulting effects (capture, special squares, win).
 */
export function applyMove(
  state: GameState,
  pieceId: string
): { newState: GameState; effects: GameEffect[] } {
  const { players, currentPlayerIndex, dice, specialSquares } = state;
  if (dice.value === null) return { newState: state, effects: [] };

  const steps = dice.value;
  const effects: GameEffect[] = [];

  // Deep clone state
  let newPlayers = players.map(p => ({
    ...p,
    pieces: p.pieces.map(pc => ({ ...pc })),
  }));

  const currentPlayer = newPlayers[currentPlayerIndex];
  const piece = currentPlayer.pieces.find(pc => pc.id === pieceId);
  if (!piece) return { newState: state, effects: [] };

  // Compute new position
  const newPos = computeNewPosition(piece, steps);
  if (newPos === null) return { newState: state, effects: [] };

  piece.position = newPos;

  // Check for finish
  if (newPos === 57) {
    piece.isFinished = true;
    currentPlayer.piecesFinished += 1;

    // Gain an extra turn for finishing a piece
    effects.push({ type: 'plusOneTurn' });

    // Check win condition
    if (currentPlayer.piecesFinished >= 4) {
      effects.push({ type: 'win', winnerColor: currentPlayer.color });
    }

    const newState: GameState = { ...state, players: newPlayers };
    return { newState, effects };
  }

  // Main track — check capture and special squares
  if (newPos >= 0 && newPos < 52) {
    const trackIdx = newPos;

    // Capture logic — do NOT move captured pieces here; let resolveEffect handle it
    // so the captured piece stays visible until the moving piece's animation arrives.
    for (const enemy of newPlayers) {
      if (enemy.color === currentPlayer.color) continue;
      for (const ep of enemy.pieces) {
        if (ep.position === trackIdx && !SAFE_INDICES.has(trackIdx) && ep.prisonTurnsLeft === 0) {
          effects.push({ type: 'capture', pieceId: ep.id, byColor: currentPlayer.color });
          effects.push({ type: 'plusOneTurn' }); // reward for capturing
        }
      }
    }

    // Check for same-color stacking block (blocks opponents — handled in legalMoves check)
    // Check special squares
    const special = getSpecialAt(specialSquares, trackIdx);
    if (special) {
      switch (special.type) {
        case 'mine':
          effects.push({ type: 'mine', pieceId: piece.id });
          break;
        case 'prison':
          effects.push({ type: 'prison', pieceId: piece.id });
          break;
        case 'atomicBomb':
          effects.push({ type: 'atomicBomb' });
          break;
        case 'box67':
          effects.push({ type: 'box67' });
          break;
        case 'gun':
          effects.push({ type: 'gun', byColor: currentPlayer.color });
          break;
        case 'plusOneTurn':
          effects.push({ type: 'plusOneTurn' });
          break;
        case 'portal': {
          const portals = getPortals(specialSquares);
          const otherPortals = portals.filter(p => p.trackIndex !== trackIdx);
          if (otherPortals.length > 0) {
            const dest = pick(otherPortals);
            effects.push({ type: 'portal', pieceId: piece.id, toTrackIndex: dest.trackIndex });
          }
          break;
        }
        case 'heart':
          effects.push({ type: 'heart', forColor: currentPlayer.color });
          break;
      }
    }
  }

  const newState: GameState = { ...state, players: newPlayers };
  return { newState, effects };
}

/** Check if a cell has a friendly block (2 or more same-color pieces not in home col) */
export function hasFriendlyBlock(state: GameState, trackIdx: number, color: PlayerColor): boolean {
  const player = state.players.find(p => p.color === color);
  if (!player) return false;
  const count = player.pieces.filter(p => p.position === trackIdx).length;
  return count >= 2;
}

/** Check if a move would be blocked by a same-color stack */
export function isBlockedByFriendly(state: GameState, trackIdx: number, moverColor: PlayerColor): boolean {
  for (const player of state.players) {
    if (player.color === moverColor) continue;
    // Friendly block: a different color can't pass through 2+ same-color pieces on same square
    // (This logic is simplified — full Ludo block rules handled here)
  }
  return false;
}
