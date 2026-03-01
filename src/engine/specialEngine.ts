import { GameState, GameEffect, Piece } from '../types/game';
import { SAFE_INDICES, COLOR_OFFSETS } from '../constants/board';

/**
 * Apply a single GameEffect to the state.
 * Returns the updated state.
 */
export function resolveEffect(state: GameState, effect: GameEffect): GameState {
  let newPlayers = state.players.map(p => ({
    ...p,
    pieces: p.pieces.map(pc => ({ ...pc })),
  }));

  switch (effect.type) {
    case 'capture': {
      // Move captured piece home and track kills/deaths
      const piece = findPiece(newPlayers, effect.pieceId);
      if (piece) {
        piece.position = -1;
        piece.prisonTurnsLeft = 0;
        // Increment death on the piece owner
        const victim = newPlayers.find(p => p.color === piece.color);
        if (victim) victim.deaths += 1;
      }
      // Increment kill on the attacker
      const attacker = newPlayers.find(p => p.color === effect.byColor);
      if (attacker) attacker.kills += 1;
      break;
    }

    case 'mine': {
      // Send piece back to home circle
      const piece = findPiece(newPlayers, effect.pieceId);
      if (piece) {
        piece.position = -1;
        piece.prisonTurnsLeft = 0;
      }
      break;
    }

    case 'prison': {
      // Imprison piece for 3 turns
      const piece = findPiece(newPlayers, effect.pieceId);
      if (piece) {
        piece.prisonTurnsLeft = 3;
      }
      break;
    }

    case 'atomicBomb': {
      // All pieces not on safe squares get sent home
      for (const player of newPlayers) {
        for (const piece of player.pieces) {
          if (piece.isFinished) continue;
          if (piece.position === -1) continue;
          if (piece.position >= 52) continue; // In home column — safe
          if (SAFE_INDICES.has(piece.position)) continue; // On safe square
          piece.position = -1;
          piece.prisonTurnsLeft = 0;
        }
      }
      break;
    }

    case 'box67': {
      // Collect all piece positions that are on the main track and not on safe squares
      const movablePieces: Piece[] = [];
      for (const player of newPlayers) {
        for (const piece of player.pieces) {
          if (piece.isFinished) continue;
          if (piece.position < 0) continue;
          if (piece.position >= 52) continue;
          if (SAFE_INDICES.has(piece.position)) continue;
          movablePieces.push(piece);
        }
      }

      // Shuffle positions
      const positions = movablePieces.map(p => p.position);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      for (let i = 0; i < movablePieces.length; i++) {
        movablePieces[i].position = positions[i];
      }
      break;
    }

    case 'portal': {
      // Teleport piece to destination portal
      const piece = findPiece(newPlayers, effect.pieceId);
      if (piece) {
        piece.position = effect.toTrackIndex;
      }
      break;
    }

    case 'gun': {
      // Gun effect is handled via selectGunTarget in the store
      // No state change here — phase transitions to gunSelect
      break;
    }

    case 'plusOneTurn': {
      // Extra turn is handled by incrementing extraTurnsQueued in the store
      break;
    }

    case 'heart': {
      // Bring one piece from home circle onto the board (at start square)
      const player = newPlayers.find(p => p.color === effect.forColor);
      if (player) {
        const homePiece = player.pieces.find(p => p.position === -1);
        if (homePiece) {
          homePiece.position = COLOR_OFFSETS[player.color];
        }
      }
      break;
    }

    case 'win': {
      // Handled by store
      break;
    }
  }

  return { ...state, players: newPlayers };
}

function findPiece(players: GameState['players'], pieceId: string): Piece | undefined {
  for (const player of players) {
    const piece = player.pieces.find(p => p.id === pieceId);
    if (piece) return piece;
  }
  return undefined;
}
