import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

// the android counterpart of use-navigation-theme.ts: the stock theme with the material you
// palette, so the app bar and the screens under it share the colors of the compose content.
export function useNavigationTheme(): Theme {
  const base = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  const colors = useMaterialColors();
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.onSurface,
      border: colors.outlineVariant,
    },
  };
}
