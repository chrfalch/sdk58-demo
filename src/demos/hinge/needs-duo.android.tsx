import DevicesFold from '@expo/material-symbols/devices_fold.xml';
import { Column, Host, Icon, Surface, Text, useMaterialColors } from '@expo/ui/jetpack-compose';
import { fillMaxSize, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { isAvailable } from 'expo-hinge';

/** shown instead of the hinge demo on an android device that reports no hinge. */
export function NeedsDuo() {
  const colors = useMaterialColors();
  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        <Column
          horizontalAlignment="center"
          verticalArrangement={{ spacedBy: 12 }}
          modifiers={[fillMaxSize(), paddingAll(32)]}>
          <Icon source={DevicesFold} size={48} tint={colors.onSurfaceVariant} />
          <Text color={colors.onSurface} style={{ typography: 'titleLarge' }}>
            Needs a foldable
          </Text>
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'bodyMedium', textAlign: 'center' }}>
            {isAvailable()
              ? 'This device has no hinge. Open this tab on a foldable, such as a Pixel Fold.'
              : 'Hinge updates need Android 11 or later.'}
          </Text>
        </Column>
      </Surface>
    </Host>
  );
}
