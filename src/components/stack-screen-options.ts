import { PlatformColor } from 'react-native';

// from nathan's expo-ui-examples root layout: a see-through native header, so swiftui lists and
// forms scroll under it with the system's scroll edge effect.
export const stackScreenOptions = {
  headerTransparent: true,
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  headerLargeStyle: { backgroundColor: 'transparent' },
  headerTitleStyle: { color: PlatformColor('label') },
  headerBlurEffect: 'none',
  headerBackButtonDisplayMode: 'minimal',
} as const;
