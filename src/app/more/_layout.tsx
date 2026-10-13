import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-screen-options';

export default function MoreLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'More', headerLargeTitle: true }} />
    </Stack>
  );
}
