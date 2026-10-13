import { Host } from '@expo/ui';
import { ContentUnavailableView } from '@expo/ui/swift-ui';

export default function MailScreen() {
  return (
    <Host style={{ flex: 1 }}>
      <ContentUnavailableView title="Mail" systemImage="envelope" />
    </Host>
  );
}
