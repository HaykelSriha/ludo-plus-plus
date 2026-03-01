import { SpecialSquare, SpecialSquareType } from '../types/game';
import { SAFE_INDICES } from '../constants/board';
import { SPECIAL_COUNTS } from '../constants/specialSquares';
import { shuffle } from '../utils/random';

/** Generate random special square placement for a new game */
export function placeSpecialSquares(): SpecialSquare[] {
  // All eligible track indices (0–51, excluding safe squares)
  const eligible: number[] = [];
  for (let i = 0; i < 52; i++) {
    if (!SAFE_INDICES.has(i)) {
      eligible.push(i);
    }
  }

  // Fisher-Yates shuffle
  shuffle(eligible);

  // Build ordered list of types to assign
  const types: SpecialSquareType[] = [];
  for (const [type, count] of Object.entries(SPECIAL_COUNTS) as [SpecialSquareType, number][]) {
    for (let i = 0; i < count; i++) {
      types.push(type);
    }
  }

  // Assign types to the first N eligible squares
  const squares: SpecialSquare[] = types.map((type, i) => {
    const sq: SpecialSquare = {
      type,
      trackIndex: eligible[i],
    };
    if (type === 'portal') {
      sq.portalGroupId = 0;
    }
    return sq;
  });

  return squares;
}

/** Find the special square at a given track index */
export function getSpecialAt(
  specialSquares: SpecialSquare[],
  trackIndex: number
): SpecialSquare | undefined {
  return specialSquares.find(sq => sq.trackIndex === trackIndex);
}

/** Get all portal squares */
export function getPortals(specialSquares: SpecialSquare[]): SpecialSquare[] {
  return specialSquares.filter(sq => sq.type === 'portal');
}
