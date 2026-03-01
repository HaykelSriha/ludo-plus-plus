import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BubbleButton } from '../src/components/ui/BubbleButton';
import { UI_COLORS } from '../src/constants/colors';

const RULES = [
  {
    title: '🎯 Goal',
    body: 'Move all 4 of your pieces from the home circle to the finish. First to do so wins!',
  },
  {
    title: '🎲 Rolling',
    body: 'Roll the dice on your turn. Roll a 6 to enter a new piece, and you get an extra roll!',
  },
  {
    title: '💥 Captures',
    body: 'Land on an opponent\'s piece to send it back home (except on safe squares ★).',
  },
  {
    title: '🛡️ Safe Squares',
    body: 'Marked with ★ — pieces here cannot be captured. Start squares are always safe.',
  },
  {
    title: '🔒 Blocks',
    body: 'Two of your pieces on the same square form a block — opponents cannot pass through.',
  },
  {
    title: '🎁 Special Squares',
    body: 'Each game has 19 randomly placed special squares:\n• 💣 Mine (×4) — sends you home\n• 🔒 Prison (×2) — stuck 3 turns\n• ☢️ Nuke (×1) — everyone goes home!\n• 🎲 Box 67 (×1) — all pieces shuffle\n• 🔫 Gun (×2) — eliminate any piece\n• ⭐ +1 Turn (×2) — roll again\n• 🌀 Portal (×4) — teleport randomly\n• ❤️ Heart (×3) — free a home piece',
  },
];

export default function RulesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📖 How to Play</Text>
        {RULES.map(rule => (
          <View key={rule.title} style={styles.card}>
            <Text style={styles.cardTitle}>{rule.title}</Text>
            <Text style={styles.cardBody}>{rule.body}</Text>
          </View>
        ))}
        <BubbleButton
          label="Got It!"
          emoji="✅"
          onPress={() => router.back()}
          color="#E94560"
          borderColor="#B91C4A"
          style={{ marginTop: 8, marginBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UI_COLORS.background },
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cardBody: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
  },
});
