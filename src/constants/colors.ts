import { PlayerColor } from '../types/game';

export const PLAYER_COLORS: Record<PlayerColor, {
  primary: string;
  light: string;
  dark: string;
  text: string;
}> = {
  blue: {
    primary: '#3B82F6',
    light: '#93C5FD',
    dark: '#1D4ED8',
    text: '#FFFFFF',
  },
  red: {
    primary: '#EF4444',
    light: '#FCA5A5',
    dark: '#B91C1C',
    text: '#FFFFFF',
  },
  green: {
    primary: '#22C55E',
    light: '#86EFAC',
    dark: '#15803D',
    text: '#FFFFFF',
  },
  yellow: {
    primary: '#EAB308',
    light: '#FDE047',
    dark: '#A16207',
    text: '#1F2937',
  },
};

export const BOARD_COLORS = {
  background: '#F8F4E9',
  cellDefault: '#FFFFFF',
  cellBorder: '#E5E7EB',
  centerArea: '#F3F4F6',
  safeSquare: '#D1FAE5',
  // Home areas
  blueHome: '#DBEAFE',
  redHome: '#FEE2E2',
  greenHome: '#DCFCE7',
  yellowHome: '#FEF9C3',
};

export const SPECIAL_COLORS: Record<string, string> = {
  box67: '#8B5CF6',
  mine: '#1F2937',
  prison: '#6B7280',
  atomicBomb: '#F97316',
  gun: '#DC2626',
  plusOneTurn: '#10B981',
  portal: '#6366F1',
  heart: '#EC4899',
};

export const UI_COLORS = {
  background: '#1A1A2E',
  card: '#16213E',
  cardAlt: '#0F3460',
  accent: '#E94560',
  text: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#334155',
};
