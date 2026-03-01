import { SpecialSquareType } from '../types/game';

export const SPECIAL_COUNTS: Record<SpecialSquareType, number> = {
  box67: 1,
  mine: 4,
  prison: 2,
  atomicBomb: 1,
  gun: 2,
  plusOneTurn: 2,
  portal: 4,
  heart: 3,
};

export const SPECIAL_LABELS: Record<SpecialSquareType, string> = {
  box67: 'Box 67',
  mine: 'Mine',
  prison: 'Prison',
  atomicBomb: 'Nuke',
  gun: 'Gun',
  plusOneTurn: '+1 Turn',
  portal: 'Portal',
  heart: 'Heart',
};

export const SPECIAL_ICONS: Record<SpecialSquareType, string> = {
  box67: '🎲',
  mine: '💣',
  prison: '🔒',
  atomicBomb: '☢️',
  gun: '🔫',
  plusOneTurn: '⭐',
  portal: '🌀',
  heart: '❤️',
};

export const SPECIAL_DESCRIPTIONS: Record<SpecialSquareType, string> = {
  box67: 'Shuffles all players on the board (except safe squares)',
  mine: 'Sends you back to home circle!',
  prison: 'Stuck for 3 turns. Even stacking allowed!',
  atomicBomb: 'KABOOM! All unprotected pieces go home.',
  gun: 'Choose any enemy piece to eliminate!',
  plusOneTurn: 'Lucky! Roll again.',
  portal: 'Teleport to a random other portal.',
  heart: 'Rescue one of your pieces from home circle.',
};

export const TOTAL_SPECIAL_SQUARES = Object.values(SPECIAL_COUNTS).reduce((a, b) => a + b, 0);
