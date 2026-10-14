import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

/** the navigation theme for headers and screen backgrounds: the stock light or dark theme. */
export function useNavigationTheme(): Theme {
  return useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
}
