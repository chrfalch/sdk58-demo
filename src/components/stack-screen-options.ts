import { Platform, PlatformColor } from 'react-native';

// from nathan's expo-ui-examples root layout: a see-through native header on ios, so swiftui
// lists and forms scroll under it with the system's scroll edge effect. android keeps the
// default app bar, flat as in material 3, in the colors of use-navigation-theme.android.ts.
export const stackScreenOptions =
  Platform.OS === 'ios'
    ? ({
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { color: PlatformColor('label') },
        headerBlurEffect: 'none',
        headerBackButtonDisplayMode: 'minimal',
      } as const)
    : { headerShadowVisible: false };
