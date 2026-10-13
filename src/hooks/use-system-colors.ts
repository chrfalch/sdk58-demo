import { PlatformColor } from 'react-native';

// ios system colors for react native screens. they follow light and dark mode.
const colors = {
  background: PlatformColor('systemBackground'),
  label: PlatformColor('label'),
  secondaryLabel: PlatformColor('secondaryLabel'),
};

export function useSystemColors() {
  return colors;
}
