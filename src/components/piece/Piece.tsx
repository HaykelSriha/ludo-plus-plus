import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { CELL_SIZE } from '../../constants/layout';
import { PLAYER_COLORS } from '../../constants/colors';
import { Piece as PieceType, PiecePosition, PlayerColor } from '../../types/game';
import { COLOR_OFFSETS, HOME_COLUMNS } from '../../constants/board';
import { toGridCoord } from '../../engine/boardPath';

// ─── Animation constants ───────────────────────────────────────────────────────
const STEP_MS = 110;         // ms per cell hop
const MAX_WALK_STEPS = 7;    // paths longer than this are teleports

// ─── Path helpers (pure, no React) ────────────────────────────────────────────

/** Advance one cell forward along this colour's route */
function stepOne(pos: PiecePosition, color: PlayerColor): PiecePosition {
  if (pos === -1) return COLOR_OFFSETS[color];       // Home circle → start square
  if (pos >= 52)  return Math.min(pos + 1, 57);      // Home column / finish

  const offset    = COLOR_OFFSETS[color];
  const relPos    = ((pos - offset) + 52) % 52;
  const nextRel   = relPos + 1;
  // At relative 51, skip the diagonal square and enter home column directly
  if (nextRel >= 51) return 52;
  return (offset + nextRel) % 52;
}

/** Return every intermediate PiecePosition between `from` (exclusive) and `to` (inclusive) */
function buildPath(from: PiecePosition, to: PiecePosition, color: PlayerColor): PiecePosition[] {
  if (from === to) return [];
  const path: PiecePosition[] = [];
  let cur = from;
  for (let i = 0; i < 58; i++) {   // 58-step safety cap
    cur = stepOne(cur, color);
    path.push(cur);
    if (cur === to) break;
  }
  return path;
}

/** Convert a PiecePosition to absolute pixel top-left on the board */
function toPx(pos: PiecePosition, color: PlayerColor, pieceIndex: number, size: number, cellSize: number) {
  const [row, col] = toGridCoord(pos, color, pieceIndex);
  return {
    x: col * cellSize + (cellSize - size) / 2,
    y: row * cellSize + (cellSize - size) / 2,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PieceProps {
  piece: PieceType;
  isSelectable: boolean;
  isMoving: boolean;
  onPress?: () => void;
  pieceSize?: number;   // rendered size (smaller when sharing a cell)
  cellOffsetX?: number; // pixel offset within cell for grouping
  cellOffsetY?: number;
  cellSize?: number;    // dynamic cell size (defaults to layout constant)
}

export const Piece: React.FC<PieceProps> = ({
  piece,
  isSelectable,
  isMoving,
  onPress,
  pieceSize,
  cellOffsetX = 0,
  cellOffsetY = 0,
  cellSize = CELL_SIZE,
}) => {
  const colors = PLAYER_COLORS[piece.color];
  const resolvedPieceSize = pieceSize ?? cellSize * 0.7;

  const init   = toPx(piece.position, piece.color, piece.index, resolvedPieceSize, cellSize);
  const animX  = useSharedValue(init.x + cellOffsetX);
  const animY  = useSharedValue(init.y + cellOffsetY);
  const hopY   = useSharedValue(0);
  const scale  = useSharedValue(1);
  const rotate = useSharedValue(0);

  const prevPosRef    = useRef<PiecePosition>(piece.position);
  const isFirstRender = useRef(true);

  // ── Idle wobble / selection pulse ─────────────────────────────────────────
  useEffect(() => {
    if (isMoving) {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = withTiming(0, { duration: 80 });
      return;
    }
    if (isSelectable) {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = withRepeat(
        withSequence(withTiming(-8, { duration: 180 }), withTiming(8, { duration: 180 })),
        -1, true,
      );
      scale.value = withRepeat(
        withSequence(withTiming(1.25, { duration: 250 }), withTiming(1.0, { duration: 250 })),
        -1, true,
      );
    } else {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      scale.value  = withSpring(1);
      rotate.value = withRepeat(
        withSequence(withTiming(-3, { duration: 1400 }), withTiming(3, { duration: 1400 })),
        -1, true,
      );
    }
  }, [isSelectable, isMoving]);

  // ── Movement animation ────────────────────────────────────────────────────
  useEffect(() => {
    const hopH = cellSize * 0.55;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPosRef.current    = piece.position;
      const px = toPx(piece.position, piece.color, piece.index, resolvedPieceSize, cellSize);
      animX.value = px.x + cellOffsetX;
      animY.value = px.y + cellOffsetY;
      return;
    }

    const prevPos = prevPosRef.current;
    const newPos  = piece.position;
    prevPosRef.current = newPos;

    // Reposition instantly when cellSize changes without a position change
    if (prevPos === newPos) {
      const px = toPx(newPos, piece.color, piece.index, resolvedPieceSize, cellSize);
      animX.value = px.x + cellOffsetX;
      animY.value = px.y + cellOffsetY;
      return;
    }

    const dest = toPx(newPos, piece.color, piece.index, resolvedPieceSize, cellSize);
    const destX = dest.x + cellOffsetX;
    const destY = dest.y + cellOffsetY;

    // ① Entering the board from home circle → pop-in at destination
    if (prevPos === -1) {
      animX.value = destX;
      animY.value = destY;
      scale.value = 0;
      scale.value = withSpring(1, { damping: 5, stiffness: 220 });
      return;
    }

    const path = buildPath(prevPos, newPos, piece.color);
    if (path.length === 0) return;

    // ② Teleport (portal / box67 / too many steps) → blackhole suck-in then whitehole burst
    if (path.length > MAX_WALK_STEPS) {
      // Black hole: shrink to 0 (sucked in)
      scale.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.quad) }, () => {
        'worklet';
        animX.value = destX;
        animY.value = destY;
      });
      // White hole: burst out after teleport
      setTimeout(() => {
        scale.value = withSequence(
          withTiming(0, { duration: 0 }),
          withSpring(1.4, { damping: 4, stiffness: 200 }),
          withSpring(1.0, { damping: 12, stiffness: 180 }),
        );
      }, 270);
      return;
    }

    // ③ Normal walk — hop cell-by-cell ────────────────────────────────────────
    const xSeq: ReturnType<typeof withTiming>[] = [];
    const ySeq: ReturnType<typeof withTiming>[] = [];
    const hopSeq: ReturnType<typeof withTiming>[] = [];

    const ease = Easing.out(Easing.quad);

    for (const pos of path) {
      const px = toPx(pos, piece.color, piece.index, resolvedPieceSize, cellSize);
      xSeq.push(withTiming(px.x + cellOffsetX, { duration: STEP_MS, easing: ease }));
      ySeq.push(withTiming(px.y + cellOffsetY, { duration: STEP_MS, easing: ease }));
      hopSeq.push(
        withTiming(-hopH, { duration: STEP_MS / 2, easing: Easing.out(Easing.quad) }),
        withTiming(0,     { duration: STEP_MS / 2, easing: Easing.in(Easing.quad) }),
      );
    }

    animX.value = withSequence(...(xSeq as [typeof xSeq[0], ...typeof xSeq]));
    animY.value = withSequence(...(ySeq as [typeof ySeq[0], ...typeof ySeq]));
    hopY.value  = withSequence(...(hopSeq as [typeof hopSeq[0], ...typeof hopSeq]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piece.position, cellOffsetX, cellOffsetY, resolvedPieceSize, cellSize]);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: animX.value,
    top:  animY.value + hopY.value,
    zIndex: 10,
    transform: [
      { scale:  scale.value  },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // Finished pieces appear slightly transparent to signal they're done
  const finishedOpacity = piece.isFinished ? 0.6 : 1;

  return (
    <Animated.View style={[animStyle, { opacity: finishedOpacity }]}>
      <TouchableOpacity
        style={[
          styles.piece,
          {
            backgroundColor: colors.primary,
            borderColor:      colors.dark,
            width:            resolvedPieceSize,
            height:           resolvedPieceSize,
            borderRadius:     resolvedPieceSize / 2,
          },
          isSelectable && styles.selectable,
        ]}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      >
        {piece.prisonTurnsLeft > 0 && (
          <Animated.Text style={[styles.prisonBadge, { fontSize: resolvedPieceSize * 0.45 }]}>
            {piece.prisonTurnsLeft}
          </Animated.Text>
        )}
        {piece.isFinished && (
          <Animated.Text style={[styles.finishedBadge, { fontSize: resolvedPieceSize * 0.4 }]}>
            ✓
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  piece: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5,
  },
  selectable: {
    shadowColor: '#FBBF24',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  prisonBadge: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  finishedBadge: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
