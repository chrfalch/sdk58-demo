import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { DemoToolbar } from '@/demos/demo-toolbar';
import { DEMOS } from '@/demos/registry';

export default function DemoScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const demo = DEMOS.find((d) => d.slug === slug);

  // unknown slugs and demos with their own tab go back to the list.
  if (!demo?.screen) return <Redirect href="/more" />;

  const Screen = demo.screen;
  return (
    <>
      <Stack.Screen options={{ title: demo.title }} />
      <DemoToolbar demo={demo} />
      <Screen />
    </>
  );
}
