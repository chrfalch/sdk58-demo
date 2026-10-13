import { useHinge } from 'expo-hinge';

import { DemoToolbar } from '@/demos/demo-toolbar';
import HingeScreen from '@/demos/hinge';
import { NeedsDuo } from '@/demos/hinge/needs-duo';
import { demo } from '@/demos/registry';

export default function DuoScreen() {
  // the hinge is null on a device without one, and before ios 27.1.
  const hinge = useHinge();
  return (
    <>
      <DemoToolbar demo={demo('hinge')} />
      {hinge ? <HingeScreen /> : <NeedsDuo />}
    </>
  );
}
