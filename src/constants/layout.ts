import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Board takes up most of the screen width with minimal padding
const AVAILABLE_WIDTH = Math.min(width, isWeb ? 520 : width) - 8;
const AVAILABLE_HEIGHT = isWeb ? Math.min(height * 0.70, 520) : Math.min(height * 0.72, AVAILABLE_WIDTH);

export const BOARD_SIZE = Math.min(AVAILABLE_WIDTH, AVAILABLE_HEIGHT);
export const CELL_SIZE = BOARD_SIZE / 15;
export const PIECE_SIZE = CELL_SIZE * 0.7;
export const HOME_CIRCLE_SIZE = CELL_SIZE * 1.6;
