import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useHaptics } from './useHaptics';

/**
 * Orchestrates the game turn flow and hooks haptics/effects to state changes.
 */
export function useGameLoop() {
  const phase = useGameStore(s => s.phase);
  const effectQueue = useGameStore(s => s.effectQueue);
  const dice = useGameStore(s => s.dice);
  const winner = useGameStore(s => s.winner);
  const { impact, notification } = useHaptics();

  // Trigger haptics on phase transitions
  useEffect(() => {
    switch (phase) {
      case 'rolled':
        impact('medium');
        break;
      case 'moving':
        impact('light');
        break;
      case 'specialEffect':
        impact('heavy');
        break;
      case 'finished':
        notification('success');
        break;
    }
  }, [phase]);

  // Haptic on dice value landing
  useEffect(() => {
    if (dice.value === 6) {
      notification('success');
    }
  }, [dice.rollCount]);

  const rollDice = useCallback(() => {
    const { phase: currentPhase, rollDice: roll } = useGameStore.getState();
    if (currentPhase === 'idle') {
      impact('medium');
      roll();
    }
  }, []);

  return { rollDice };
}
