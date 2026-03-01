import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CELL_SIZE } from '../../constants/layout';
import { PLAYER_COLORS, BOARD_COLORS } from '../../constants/colors';
import { PlayerColor } from '../../types/game';

interface HomeAreaProps {
  color: PlayerColor;
  position: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
}

const HOME_BG: Record<PlayerColor, string> = {
  blue: BOARD_COLORS.blueHome,
  red: BOARD_COLORS.redHome,
  green: BOARD_COLORS.greenHome,
  yellow: BOARD_COLORS.yellowHome,
};

export const HomeArea: React.FC<HomeAreaProps> = ({ color }) => {
  const size = CELL_SIZE * 6;
  const circleSize = CELL_SIZE * 1.8;
  const primaryColor = PLAYER_COLORS[color].primary;
  const bgColor = HOME_BG[color];

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor: bgColor }]}>
      {/* Four circles in 2×2 grid */}
      <View style={styles.circleGrid}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: primaryColor,
                borderColor: PLAYER_COLORS[color].dark,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * 4.5,
    height: CELL_SIZE * 4.5,
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  circle: {
    borderWidth: 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
