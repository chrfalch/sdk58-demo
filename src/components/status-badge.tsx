import { Text } from '@expo/ui/swift-ui';
import { background, font, foregroundStyle, padding, shapes } from '@expo/ui/swift-ui/modifiers';

import { StatusColors } from '@/constants/theme';
import type { Status } from '@/demos/registry';

/** a changelog label in a capsule, tinted by the label. */
export function StatusBadge({ status }: { status: Status }) {
  const color = StatusColors[status];
  return (
    <Text
      modifiers={[
        font({ textStyle: 'caption', weight: 'semibold' }),
        foregroundStyle(color),
        padding({ horizontal: 8, vertical: 3 }),
        // the label color at 15% opacity
        background(`${color}26`, shapes.capsule()),
      ]}>
      {status}
    </Text>
  );
}
