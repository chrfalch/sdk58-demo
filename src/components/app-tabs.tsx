import { NativeTabs } from 'expo-router/native-tabs';

// expo router native tabs, stable in sdk 58: a native tab bar with sf symbols.
export default function AppTabs() {
  return (
    <NativeTabs sidebarAdaptable>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Mail</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'envelope', selected: 'envelope.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="duo">
        <NativeTabs.Trigger.Label>Duo</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.split.2x1" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
