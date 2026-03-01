import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { AnimatedLogo } from '../src/components/ui/AnimatedLogo';
import { BubbleButton } from '../src/components/ui/BubbleButton';
import { UI_COLORS } from '../src/constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <AnimatedLogo />
        </View>

        <View style={styles.description}>
          <Text style={styles.descText}>2–4 players · Pass the phone · Utter chaos!</Text>
          <View style={styles.tagRow}>
            {['💣 Mines', '🔫 Guns', '🌀 Portals', '☢️ Nukes', '🔒 Prison'].map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttons}>
          <BubbleButton
            label="Play!"
            emoji="🎮"
            onPress={() => router.push('/setup')}
            color="#E94560"
            borderColor="#B91C4A"
          />
          <BubbleButton
            label="Rules"
            emoji="📖"
            onPress={() => router.push('/rules' as any)}
            color="#0F3460"
            borderColor="#1D4ED8"
            style={{ marginTop: 12 }}
          />
        </View>

        <Text style={styles.footer}>Ludo++ © 2025</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: UI_COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoArea: {
    alignItems: 'center',
  },
  description: {
    alignItems: 'center',
    gap: 12,
  },
  descText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    maxWidth: 340,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tagText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    color: '#475569',
    fontSize: 12,
  },
});
