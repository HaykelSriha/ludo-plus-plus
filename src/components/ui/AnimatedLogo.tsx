import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

export const AnimatedLogo: React.FC = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -15, duration: 700, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 5, stiffness: 150, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: -5, duration: 500, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 5, duration: 500, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 250, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotateStr = rotate.interpolate({ inputRange: [-5, 5], outputRange: ['-5deg', '5deg'] });

  return (
    <Animated.View style={{ transform: [{ translateY }, { rotate: rotateStr }] }}>
      <Text style={styles.logo}>🎲</Text>
      <Text style={styles.title}>Ludo++</Text>
      <Text style={styles.subtitle}>The Chaotic Edition!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 72,
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#E94560',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
});
