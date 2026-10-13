// the inbox home screen widget on ios. expo-widgets runs this function in the widget extension's
// own runtime, so it renders @expo/ui/swift-ui components, uses no hooks, and gets everything
// through its props. it cannot use anything declared outside the function.
// inbox-widget.android.tsx is the android layout of the same widget, which is new in sdk 58.
import { Button, HStack, Image, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, frame, lineLimit, tint } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { InboxWidgetProps } from './types';

const InboxWidget = (props: InboxWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const medium = environment.widgetFamily === 'systemMedium';
  const shown = props.messages.slice(0, medium ? 3 : 1);
  const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });
  const fill = frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'topLeading' });

  const summary = (
    <VStack alignment="leading" spacing={4}>
      <HStack spacing={6}>
        <Image systemName="envelope.fill" size={15} color="#007AFF" />
        <Text modifiers={[font({ textStyle: 'headline' })]}>Inbox</Text>
      </HStack>
      <Text modifiers={[font({ textStyle: 'subheadline' }), foregroundStyle('#007AFF')]}>
        {props.unread === 0 ? 'No unread mail' : `${props.unread} unread`}
      </Text>
    </VStack>
  );

  const list =
    shown.length === 0 ? (
      <Text modifiers={[font({ textStyle: 'subheadline' }), secondary]}>
        You are all caught up.
      </Text>
    ) : (
      <VStack alignment="leading" spacing={8}>
        {shown.map((message) => (
          <HStack key={message.id} spacing={6}>
            <Image systemName="circle.fill" size={7} color="#007AFF" />
            <VStack alignment="leading" spacing={0}>
              <Text
                modifiers={[font({ textStyle: 'subheadline', weight: 'semibold' }), lineLimit(1)]}>
                {message.sender}
              </Text>
              <Text modifiers={[font({ textStyle: 'caption' }), secondary, lineLimit(1)]}>
                {message.subject}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    );

  // the value onPress returns becomes the widget's new props, with no app process needed.
  // the app mirrors the tap through addUserInteractionListener when it runs.
  const markAllRead =
    props.unread > 0 ? (
      <Button
        label="Mark all read"
        systemImage="envelope.open"
        target="markAllRead"
        onPress={() => ({ unread: 0, messages: [] })}
        modifiers={[font({ textStyle: 'caption' }), tint('#007AFF')]}
      />
    ) : null;

  // medium: the summary and the button on the left, the newest unread mail on the right.
  if (medium) {
    return (
      <HStack alignment="top" spacing={16} modifiers={[fill]}>
        <VStack alignment="leading" spacing={0} modifiers={[frame({ maxHeight: Infinity })]}>
          {summary}
          <Spacer />
          {markAllRead}
        </VStack>
        {list}
        <Spacer />
      </HStack>
    );
  }

  return (
    <VStack alignment="leading" spacing={8} modifiers={[fill]}>
      {summary}
      {list}
      <Spacer />
      {markAllRead}
    </VStack>
  );
};

export default createWidget<InboxWidgetProps>('InboxWidget', InboxWidget, {
  unread: 0,
  messages: [],
});
