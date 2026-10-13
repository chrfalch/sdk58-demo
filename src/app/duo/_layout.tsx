import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-screen-options';

export default function DuoLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Hinge' }} />
    </Stack>
  );
}
