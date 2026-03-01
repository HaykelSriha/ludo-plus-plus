import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { CELL_SIZE } from '../../constants/layout';
import { PLAYER_COLORS } from '../../constants/colors';

interface CenterTriangleProps {
  cellSize?: number;
}

export const CenterTriangle: React.FC<CenterTriangleProps> = ({ cellSize = CELL_SIZE }) => {
  const SIZE = cellSize * 3;
  const MID = SIZE / 2;

  return (
    <View style={{ width: SIZE, height: SIZE, overflow: 'hidden' }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Red triangle — top */}
        <Polygon points={`${MID},${MID} 0,0 ${SIZE},0`} fill={PLAYER_COLORS.red.primary} opacity={0.85} />
        {/* Green triangle — right */}
        <Polygon points={`${MID},${MID} ${SIZE},0 ${SIZE},${SIZE}`} fill={PLAYER_COLORS.green.primary} opacity={0.85} />
        {/* Yellow triangle — bottom */}
        <Polygon points={`${MID},${MID} ${SIZE},${SIZE} 0,${SIZE}`} fill={PLAYER_COLORS.yellow.primary} opacity={0.85} />
        {/* Blue triangle — left */}
        <Polygon points={`${MID},${MID} 0,${SIZE} 0,0`} fill={PLAYER_COLORS.blue.primary} opacity={0.85} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({});
