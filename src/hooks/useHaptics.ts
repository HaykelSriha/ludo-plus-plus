import { Platform } from 'react-native';

let Haptics: typeof import('expo-haptics') | null = null;

if (Platform.OS !== 'web') {
  try {
    Haptics = require('expo-haptics');
  } catch {
    Haptics = null;
  }
}

export function useHaptics() {
  const impact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!Haptics) return;
    const styleMap = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    Haptics.impactAsync(styleMap[style]).catch(() => {});
  };

  const notification = (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!Haptics) return;
    const typeMap = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    };
    Haptics.notificationAsync(typeMap[type]).catch(() => {});
  };

  const selection = () => {
    if (!Haptics) return;
    Haptics.selectionAsync().catch(() => {});
  };

  return { impact, notification, selection };
}
