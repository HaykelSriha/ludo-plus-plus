import { create } from 'zustand';
import {
  GameState,
  GamePhase,
  Player,
  PlayerColor,
  Piece,
  DiceState,
  GameEffect,
} from '../types/game';
import { placeSpecialSquares } from '../engine/specialPlacement';
import { legalMoves, applyMove } from '../engine/moveEngine';
import { resolveEffect } from '../engine/specialEngine';
import { COLOR_OFFSETS } from '../constants/board';

const ALL_COLORS: PlayerColor[] = ['blue', 'red', 'green', 'yellow'];
const COLOR_NAMES: Record<PlayerColor, string> = {
  blue: 'Blue',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
};

function createPlayer(color: PlayerColor, index: number): Player {
  const pieces: Piece[] = Array.from({ length: 4 }, (_, i) => ({
    id: `${color}-${i}`,
    color,
    index: i,
    position: -1,
    prisonTurnsLeft: 0,
    isFinished: false,
  }));
  return {
    id: `player-${index}`,
    color,
    name: COLOR_NAMES[color],
    pieces,
    piecesFinished: 0,
    kills: 0,
    deaths: 0,
  };
}

const INITIAL_DICE: DiceState = {
  value: null,
  isRolling: false,
  rollCount: 0,
};

const initialState: GameState = {
  playerCount: 2,
  players: [],
  currentPlayerIndex: 0,
  phase: 'idle' as GamePhase,
  dice: INITIAL_DICE,
  extraTurnsQueued: 0,
  specialSquares: [],
  selectablePieceIds: [],
  pendingGunSelectBy: null,
  effectQueue: [],
  winner: null,
};

interface GameActions {
  initGame: (playerCount: number, colors?: PlayerColor[]) => void;
  rollDice: () => void;
  movePiece: (pieceId: string) => void;
  selectGunTarget: (targetPieceId: string) => void;
  processNextEffect: () => void;
  advanceTurn: () => void;
  resetGame: () => void;
}

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initGame: (playerCount, colors) => {
    const selectedColors = colors ?? ALL_COLORS.slice(0, playerCount);
    const players = selectedColors.slice(0, playerCount).map(
      (color, i) => createPlayer(color, i)
    );
    const specialSquares = placeSpecialSquares();

    set({
      ...initialState,
      playerCount,
      players,
      specialSquares,
      phase: 'idle',
    });
  },

  rollDice: () => {
    const { phase, players, currentPlayerIndex } = get();
    if (phase !== 'idle') return;

    const value = Math.floor(Math.random() * 6) + 1;
    const newDice: DiceState = {
      value,
      isRolling: true,
      rollCount: get().dice.rollCount + 1,
    };

    set({ dice: newDice, phase: 'rolled' });

    // After a short delay (animation), compute legal moves
    setTimeout(() => {
      const state = get();
      const movable = legalMoves(state);
      const diceSettled: DiceState = { ...state.dice, isRolling: false };

      if (movable.length === 0) {
        // No legal moves → skip turn
        set({ dice: diceSettled, selectablePieceIds: [] });
        get().advanceTurn();
      } else if (movable.length === 1) {
        // Only one movable piece — auto-move it, no need to tap
        set({ dice: diceSettled, selectablePieceIds: [movable[0]] });
        get().movePiece(movable[0]);
      } else {
        // If every movable piece is in the home circle they're all equivalent —
        // auto-pick the first one so the player doesn't have to choose.
        const currentPlayer = state.players[state.currentPlayerIndex];
        const allAtHome = movable.every(id =>
          currentPlayer.pieces.find(pc => pc.id === id)?.position === -1
        );
        if (allAtHome) {
          set({ dice: diceSettled, selectablePieceIds: [movable[0]] });
          get().movePiece(movable[0]);
        } else {
          set({ dice: diceSettled, selectablePieceIds: movable });
        }
      }
    }, 800);
  },

  movePiece: (pieceId) => {
    const state = get();
    if (state.phase !== 'rolled') return;
    if (!state.selectablePieceIds.includes(pieceId)) return;

    const { newState, effects } = applyMove(state, pieceId);

    set({
      ...newState,
      phase: 'moving',
      selectablePieceIds: [],
      effectQueue: effects,
    });

    // Wait for the hop animation to finish before processing effects.
    // Worst case: 6 dice steps × 110 ms/step = 660 ms → use 800 ms for comfort.
    setTimeout(() => {
      const currentState = get();
      if (currentState.effectQueue.length > 0) {
        set({ phase: 'specialEffect' });
        get().processNextEffect();
      } else {
        // Check if roll was a 6 → extra turn
        const diceVal = currentState.dice.value;
        if (diceVal === 6) {
          set({ extraTurnsQueued: currentState.extraTurnsQueued + 1 });
        }
        get().advanceTurn();
      }
    }, 800);
  },

  processNextEffect: () => {
    const state = get();
    const { effectQueue } = state;

    if (effectQueue.length === 0) {
      // Check if roll was 6
      const diceVal = state.dice.value;
      if (diceVal === 6) {
        set({ extraTurnsQueued: state.extraTurnsQueued + 1 });
      }
      get().advanceTurn();
      return;
    }

    const [currentEffect, ...remainingEffects] = effectQueue;

    // Handle gun — highlight eligible enemy pieces directly on board
    if (currentEffect.type === 'gun') {
      const byColor = currentEffect.byColor;
      // Compute eligible enemy pieces on the main track
      const eligibleIds: string[] = [];
      for (const player of state.players) {
        if (player.color === byColor) continue;
        for (const pc of player.pieces) {
          if (!pc.isFinished && pc.position >= 0 && pc.position < 52) {
            eligibleIds.push(pc.id);
          }
        }
      }
      set({
        phase: 'gunSelect',
        pendingGunSelectBy: byColor,
        effectQueue: remainingEffects,
        selectablePieceIds: eligibleIds,
      });
      // If no eligible targets, auto-skip after a short delay
      if (eligibleIds.length === 0) {
        setTimeout(() => {
          set({ pendingGunSelectBy: null, selectablePieceIds: [] });
          const s = get();
          if (s.effectQueue.length > 0) get().processNextEffect();
          else get().advanceTurn();
        }, 400);
      }
      return;
    }

    // Handle plusOneTurn
    if (currentEffect.type === 'plusOneTurn') {
      set({
        extraTurnsQueued: state.extraTurnsQueued + 1,
        effectQueue: remainingEffects,
      });
      setTimeout(() => get().processNextEffect(), 400);
      return;
    }

    // Handle win
    if (currentEffect.type === 'win') {
      const winner = state.players.find(p => p.color === currentEffect.winnerColor) ?? null;
      set({
        phase: 'finished',
        winner,
        effectQueue: [],
      });
      return;
    }

    // For effects that have a visual overlay (box67, atomicBomb, prison):
    // Apply the effect to state BUT keep the effect in effectQueue so game.tsx's
    // useEffect can detect effectQueue[0] and show the overlay. React 18 batches
    // synchronous set() calls, so if we consumed the effect AND set phase in the
    // same render, the overlay check would see an empty queue and never trigger.
    const visualEffects = ['box67', 'atomicBomb', 'prison'];
    if (visualEffects.includes(currentEffect.type)) {
      const newState = resolveEffect(state, currentEffect);
      // Set new shuffled/bombed state, but keep currentEffect in queue temporarily
      set({
        ...newState,
        phase: 'specialEffect',
        // effectQueue intentionally NOT updated yet — keeps box67 at [0] for overlay detection
      });
      // After the overlay animation finishes, consume the effect and continue
      setTimeout(() => {
        set({ effectQueue: remainingEffects });
        setTimeout(() => {
          const s = get();
          if (s.effectQueue.length > 0) {
            get().processNextEffect();
          } else {
            if (s.dice.value === 6) {
              set({ extraTurnsQueued: s.extraTurnsQueued + 1 });
            }
            get().advanceTurn();
          }
        }, 200);
      }, 1400);
      return;
    }

    // Apply the effect to state (non-visual effects: capture, mine, portal, heart, etc.)
    const newState = resolveEffect(state, currentEffect);

    set({
      ...newState,
      effectQueue: remainingEffects,
      phase: 'specialEffect',
    });

    setTimeout(() => {
      // Check for win after effect
      const updatedState = get();
      const winnerPlayer = updatedState.players.find(p => p.piecesFinished >= 4);
      if (winnerPlayer) {
        set({ phase: 'finished', winner: winnerPlayer, effectQueue: [] });
        return;
      }

      if (updatedState.effectQueue.length > 0) {
        get().processNextEffect();
      } else {
        // Check if roll was 6
        if (updatedState.dice.value === 6) {
          set({ extraTurnsQueued: updatedState.extraTurnsQueued + 1 });
        }
        get().advanceTurn();
      }
    }, 800);
  },

  selectGunTarget: (targetPieceId) => {
    const state = get();
    if (state.phase !== 'gunSelect') return;

    const byColor = state.pendingGunSelectBy;

    // Send target piece home and track kills/deaths
    const newPlayers = state.players.map(p => ({
      ...p,
      pieces: p.pieces.map(pc => {
        if (pc.id === targetPieceId) {
          return { ...pc, position: -1, prisonTurnsLeft: 0 };
        }
        return pc;
      }),
      kills: byColor && p.color === byColor ? p.kills + 1 : p.kills,
      deaths: p.pieces.some(pc => pc.id === targetPieceId) ? p.deaths + 1 : p.deaths,
    }));

    set({
      players: newPlayers,
      phase: 'specialEffect',
      pendingGunSelectBy: null,
      selectablePieceIds: [],
    });

    setTimeout(() => {
      const updatedState = get();
      if (updatedState.effectQueue.length > 0) {
        get().processNextEffect();
      } else {
        if (updatedState.dice.value === 6) {
          set({ extraTurnsQueued: updatedState.extraTurnsQueued + 1 });
        }
        get().advanceTurn();
      }
    }, 400);
  },

  advanceTurn: () => {
    const state = get();

    if (state.phase === 'finished') return;

    // If extra turns queued (rolled a 6 or +1 Turn square)
    if (state.extraTurnsQueued > 0) {
      set({
        extraTurnsQueued: state.extraTurnsQueued - 1,
        phase: 'idle',
        dice: { ...state.dice, value: null },
        selectablePieceIds: [],
        pendingGunSelectBy: null,
      });
      return;
    }

    // Deep-clone players so we can mutate prison counters safely
    let newPlayers = state.players.map(p => ({
      ...p,
      pieces: p.pieces.map(pc => ({ ...pc })),
    }));

    let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;

    // Skip players whose every unfinished piece is in prison (prisonTurnsLeft > 0).
    // NOTE: pieces in the home circle (position === -1) are NOT imprisoned —
    // those players can still roll and enter on a 6.
    for (let attempts = 0; attempts < newPlayers.length; attempts++) {
      const candidate = newPlayers[nextIndex];
      const unfinished = candidate.pieces.filter(p => !p.isFinished);

      // Player can act if ANY unfinished piece is NOT currently imprisoned
      const canPlay = unfinished.length === 0 || unfinished.some(p => p.prisonTurnsLeft === 0);
      if (canPlay) break;

      // Entire active roster is imprisoned — tick their prison down and skip
      for (const piece of candidate.pieces) {
        if (piece.prisonTurnsLeft > 0) {
          piece.prisonTurnsLeft = Math.max(0, piece.prisonTurnsLeft - 1);
        }
      }
      nextIndex = (nextIndex + 1) % newPlayers.length;
    }

    // Tick prison down for the player who is now about to take their turn
    for (const piece of newPlayers[nextIndex].pieces) {
      if (piece.prisonTurnsLeft > 0) {
        piece.prisonTurnsLeft = Math.max(0, piece.prisonTurnsLeft - 1);
      }
    }

    set({
      players: newPlayers,
      currentPlayerIndex: nextIndex,
      phase: 'idle',
      dice: { ...state.dice, value: null },
      selectablePieceIds: [],
      pendingGunSelectBy: null,
      effectQueue: [],
      extraTurnsQueued: 0,
    });
  },

  resetGame: () => {
    set({ ...initialState });
  },
}));
