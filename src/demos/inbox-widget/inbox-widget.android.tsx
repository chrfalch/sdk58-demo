// the inbox home screen widget on android, new in sdk 58. expo-widgets runs this function in its
// own hermes runtime, so it renders @expo/ui/jetpack-compose components (drawn with glance), uses
// no hooks, and gets everything through its props. it cannot use anything declared outside the
// function. inbox-widget.tsx is the ios layout of the same widget.
import {
  Box,
  Button,
  Column,
  Row,
  Spacer,
  Text,
  getMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  cornerRadius,
  fillMaxSize,
  fillMaxWidth,
  height,
  padding,
  paddingAll,
  size,
} from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

import type { InboxWidgetProps } from './types';

const InboxWidget = (props: InboxWidgetProps) => {
  'widget';
  // the device's material you palette, taken from the wallpaper.
  const colors = getMaterialColors();
  const shown = props.messages.slice(0, 3);

  return (
    <Column
      modifiers={[
        fillMaxSize(),
        cornerRadius(24),
        background(colors.surfaceContainer),
        paddingAll(16),
      ]}>
      <Text color={colors.onSurface} style={{ typography: 'titleLarge' }}>
        Inbox
      </Text>
      <Text color={colors.primary} style={{ typography: 'labelLarge' }}>
        {props.unread === 0 ? 'No unread mail' : `${props.unread} unread`}
      </Text>

      {shown.length === 0 ? (
        <Text
          color={colors.onSurfaceVariant}
          style={{ typography: 'bodyMedium' }}
          modifiers={[padding(0, 12, 0, 0)]}>
          You are all caught up.
        </Text>
      ) : (
        shown.map((message) => (
          <Row
            key={message.id}
            verticalAlignment="center"
            modifiers={[fillMaxWidth(), padding(0, 10, 0, 0)]}>
            <Box modifiers={[size(8, 8), cornerRadius(4), background(colors.primary)]} />
            <Column modifiers={[padding(10, 0, 0, 0)]}>
              <Text maxLines={1} color={colors.onSurface} style={{ typography: 'titleSmall' }}>
                {message.sender}
              </Text>
              <Text
                maxLines={1}
                color={colors.onSurfaceVariant}
                style={{ typography: 'bodySmall' }}>
                {message.subject}
              </Text>
            </Column>
          </Row>
        ))
      )}

      {/* a spacer, not padding: on a widget, padding sits inside the button's background. */}
      <Spacer modifiers={[height(12)]} />
      {props.unread > 0 ? (
        // the value onClick returns becomes the widget's new props, with no app process needed.
        // the app mirrors the tap through addUserInteractionListener when it runs.
        <Button
          // @ts-expect-error the android widget renderer reads `target`, but the compose Button
          // type does not declare it yet (@expo/ui 58.0.16).
          target="markAllRead"
          onClick={() => ({ unread: 0, messages: [] })}
          colors={{ containerColor: colors.primary, contentColor: colors.onPrimary }}
          contentPadding={{ start: 16, end: 16, top: 10, bottom: 10 }}
          modifiers={[cornerRadius(20)]}>
          <Text>Mark all read</Text>
        </Button>
      ) : null}
    </Column>
  );
};

export default createWidget<InboxWidgetProps>('InboxWidget', InboxWidget, {
  unread: 0,
  messages: [],
});
