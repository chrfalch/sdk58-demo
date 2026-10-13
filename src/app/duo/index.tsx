import { Host } from '@expo/ui';
import { ContentUnavailableView } from '@expo/ui/swift-ui';

import { DemoToolbar } from '@/demos/demo-toolbar';
import { demo } from '@/demos/registry';

export default function DuoScreen() {
  return (
    <>
      <DemoToolbar demo={demo('hinge')} />
      <Host style={{ flex: 1 }}>
        <ContentUnavailableView title="Hinge" systemImage="rectangle.split.2x1" />
      </Host>
    </>
  );
}
