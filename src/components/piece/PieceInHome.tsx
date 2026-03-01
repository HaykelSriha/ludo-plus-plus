import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { CELL_SIZE, PIECE_SIZE } from '../../constants/layout';
import { PLAYER_COLORS } from '../../constants/colors';
import { Piece } from '../../types/game';

interface PieceInHomeProps {
  piece: Piece;
  row: number;
  col: number;
  isSelectable: boolean;
  onPress?: () => void;
  cellSize?: number;
}

export const PieceInHome: React.FC<PieceInHomeProps> = ({
  piece, row, col, isSelectable, onPress, cellSize = CELL_SIZE
}) => {
  const colors = PLAYER_COLORS[piece.color];
  const scale = useSharedValue(1);
  const pieceSize = cellSize * 0.7;

  React.useEffect(() => {
    if (isSelectable) {
      scale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 300 }), withTiming(0.9, { duration: 300 })),
        -1, true
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isSelectable]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const left = col * cellSize + (cellSize - pieceSize) / 2;
  const top = row * cellSize + (cellSize - pieceSize) / 2;

  return (
    <Animated.View style={[styles.wrapper, { left, top }, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.piece,
          {
            backgroundColor: colors.primary,
            borderColor: colors.dark,
            width: pieceSize,
            height: pieceSize,
            borderRadius: pieceSize / 2,
          },
          isSelectable && styles.selectable,
        ]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  piece: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  selectable: {
    shadowColor: '#FBBF24',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
    borderColor: '#FBBF24',
  },
});
