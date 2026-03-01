import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  const Wrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;
  return (
    <Wrapper style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1A1A2E' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="game" />
        <Stack.Screen name="victory" />
        <Stack.Screen name="rules" />
      </Stack>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
