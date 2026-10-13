import { useMaterialColors } from '@expo/ui/jetpack-compose';

// the android counterpart of use-system-colors.ts: the material you palette, which follows the
// wallpaper and dark mode. android text color attributes are color state lists, which
// PlatformColor cannot read, so react native screens take these colors instead.
export function useSystemColors() {
  const colors = useMaterialColors();
  return {
    background: colors.background,
    label: colors.onSurface,
    secondaryLabel: colors.onSurfaceVariant,
  };
}
