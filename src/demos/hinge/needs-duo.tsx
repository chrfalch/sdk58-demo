import { Host } from '@expo/ui';
import { ContentUnavailableView } from '@expo/ui/swift-ui';
import { isAvailable } from 'expo-hinge';

/** shown instead of the hinge demo on a device that reports no hinge. */
export function NeedsDuo() {
  return (
    <Host style={{ flex: 1 }}>
      <ContentUnavailableView
        title="Needs iPhone Duo"
        systemImage="rectangle.split.2x1"
        description={
          isAvailable()
            ? 'This device has no hinge. Open this tab on an iPhone Duo.'
            : 'The hinge demo needs an iPhone Duo with iOS 27.1, in a build made with Xcode 27.1.'
        }
      />
    </Host>
  );
}
