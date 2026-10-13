// the android mail tab. NavigationSplitView is swiftui only, so android gets a material 3 inbox
// built from the same mail-data.ts: the list, then the message. on a wide window, such as an
// unfolded pixel fold, the message sits beside the list. the row style follows nathan's grouped
// list (src/app/index.android.tsx in expo-ui-examples).
import ArrowBack from '@expo/material-symbols/arrow_back.xml';
import Description from '@expo/material-symbols/description.xml';
import Flag from '@expo/material-symbols/flag.xml';
import Info from '@expo/material-symbols/info.xml';
import {
  Box,
  Card,
  Column,
  HorizontalDivider,
  Host,
  Icon,
  IconButton,
  LazyColumn,
  ListItem,
  Row,
  Surface,
  Text,
  useMaterialColors,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clickable,
  clip,
  fillMaxHeight,
  fillMaxSize,
  fillMaxWidth,
  padding,
  paddingAll,
  Shapes,
  size,
  verticalScroll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useState } from 'react';
import { BackHandler, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { openChangelog } from '@/demos/demo-toolbar';
import { demo } from '@/demos/registry';

import { MESSAGES, messagesIn, type Message } from './mail-data';

const about = demo('mail');

export default function InboxScreen() {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();
  const wide = useWindowDimensions().width >= 600;
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [openId, setOpenId] = useState<string | null>(null);

  const inbox = messagesIn('inbox', messages);
  const unread = inbox.filter((m) => m.unread).length;
  const open = messages.find((m) => m.id === openId);

  const openMessage = (id: string) => {
    setOpenId(id);
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  // on a phone, the back gesture closes the message and shows the list again.
  useEffect(() => {
    if (wide || !openId) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpenId(null);
      return true;
    });
    return () => subscription.remove();
  }, [wide, openId]);

  const list = (
    <LazyColumn
      modifiers={wide ? [weight(0.42), fillMaxHeight()] : [fillMaxSize()]}
      verticalArrangement={{ spacedBy: 3 }}
      contentPadding={{ start: 16, end: 16, top: insets.top + 8, bottom: 24 }}>
      <Row verticalAlignment="center" modifiers={[fillMaxWidth(), padding(4, 8, 0, 16)]}>
        <Column modifiers={[weight(1)]}>
          <Text color={colors.onBackground} style={{ typography: 'displaySmall' }}>
            Inbox
          </Text>
          <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyMedium' }}>
            {unread === 0 ? 'No unread mail' : `${unread} unread`}
          </Text>
        </Column>
        <IconButton onClick={() => openChangelog(about)}>
          <Icon source={Info} size={24} tint={colors.onSurfaceVariant} />
        </IconButton>
      </Row>
      {inbox.map((message, index) => (
        <MessageRow
          key={message.id}
          message={message}
          selected={wide && message.id === openId}
          first={index === 0}
          last={index === inbox.length - 1}
          colors={colors}
          onPress={() => openMessage(message.id)}
        />
      ))}
    </LazyColumn>
  );

  const detail = open ? (
    <MessageDetail
      message={open}
      colors={colors}
      topInset={insets.top}
      onBack={wide ? undefined : () => setOpenId(null)}
      modifiers={wide ? [weight(0.58), fillMaxHeight()] : [fillMaxSize()]}
    />
  ) : (
    <Box
      contentAlignment="center"
      modifiers={wide ? [weight(0.58), fillMaxHeight()] : [fillMaxSize()]}>
      <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyLarge' }}>
        Pick a message in Inbox.
      </Text>
    </Box>
  );

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        {wide ? (
          <Row modifiers={[fillMaxSize()]}>
            {list}
            {detail}
          </Row>
        ) : open ? (
          detail
        ) : (
          list
        )}
      </Surface>
    </Host>
  );
}

// Material 3 "grouped list" corners, as in nathan's list: only the outer corners are round.
function corners(first: boolean, last: boolean) {
  const top = first ? 24 : 6;
  const bottom = last ? 24 : 6;
  return { topStart: top, topEnd: top, bottomStart: bottom, bottomEnd: bottom };
}

function MessageRow({
  message,
  selected,
  first,
  last,
  colors,
  onPress,
}: {
  message: Message;
  selected: boolean;
  first: boolean;
  last: boolean;
  colors: MaterialColors;
  onPress: () => void;
}) {
  return (
    <ListItem
      colors={{
        containerColor: selected ? colors.secondaryContainer : colors.surfaceContainerHigh,
        contentColor: colors.onSurface,
        supportingContentColor: colors.onSurfaceVariant,
        trailingContentColor: colors.onSurfaceVariant,
      }}
      // `clip` before `clickable` so the ripple stays inside the shape.
      modifiers={[
        fillMaxWidth(),
        clip(Shapes.RoundedCorner(corners(first, last))),
        clickable(onPress),
      ]}>
      <ListItem.LeadingContent>
        <Avatar message={message} />
      </ListItem.LeadingContent>
      <ListItem.HeadlineContent>
        <Text
          maxLines={1}
          overflow="ellipsis"
          style={{ typography: 'titleMedium', fontWeight: message.unread ? '700' : '400' }}>
          {message.sender}
        </Text>
      </ListItem.HeadlineContent>
      <ListItem.SupportingContent>
        <Column>
          <Text
            maxLines={1}
            overflow="ellipsis"
            color={colors.onSurface}
            style={{ typography: 'bodyMedium', fontWeight: message.unread ? '700' : '400' }}>
            {message.subject}
          </Text>
          <Text maxLines={1} overflow="ellipsis" style={{ typography: 'bodyMedium' }}>
            {message.body[0]}
          </Text>
        </Column>
      </ListItem.SupportingContent>
      <ListItem.TrailingContent>
        <Column horizontalAlignment="end" verticalArrangement={{ spacedBy: 6 }}>
          <Text style={{ typography: 'labelMedium' }}>{message.time}</Text>
          {message.unread ? (
            <Box modifiers={[size(10, 10), clip(Shapes.Circle), background(colors.primary)]} />
          ) : message.flagged ? (
            <Icon source={Flag} size={16} tint="#FF9500" />
          ) : null}
        </Column>
      </ListItem.TrailingContent>
    </ListItem>
  );
}

function Avatar({ message, big = false }: { message: Message; big?: boolean }) {
  const side = big ? 48 : 40;
  return (
    <Box
      contentAlignment="center"
      modifiers={[size(side, side), clip(Shapes.Circle), background(message.color)]}>
      <Text color="#FFFFFF" style={{ typography: big ? 'titleLarge' : 'titleMedium' }}>
        {message.sender.charAt(0)}
      </Text>
    </Box>
  );
}

function MessageDetail({
  message,
  colors,
  topInset,
  onBack,
  modifiers,
}: {
  message: Message;
  colors: MaterialColors;
  topInset: number;
  onBack?: () => void;
  modifiers: Parameters<typeof Column>[0]['modifiers'];
}) {
  return (
    <Column
      verticalArrangement={{ spacedBy: 16 }}
      modifiers={[...(modifiers ?? []), verticalScroll(), padding(20, topInset + 8, 20, 24)]}>
      {onBack ? (
        <IconButton onClick={onBack}>
          <Icon source={ArrowBack} size={24} tint={colors.onSurface} />
        </IconButton>
      ) : null}
      <Text color={colors.onBackground} style={{ typography: 'headlineSmall' }}>
        {message.subject}
      </Text>
      <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 12 }}>
        <Avatar message={message} big />
        <Column modifiers={[weight(1)]}>
          <Text color={colors.onSurface} style={{ typography: 'titleMedium' }}>
            {message.sender}
          </Text>
          <Text color={colors.onSurfaceVariant} style={{ typography: 'bodyMedium' }}>
            To: Rami
          </Text>
        </Column>
        <Text color={colors.onSurfaceVariant} style={{ typography: 'labelMedium' }}>
          {message.date}
        </Text>
      </Row>
      <HorizontalDivider color={colors.outlineVariant} />
      {message.body.map((paragraph, i) => (
        <Text key={i} color={colors.onSurface} style={{ typography: 'bodyLarge' }}>
          {paragraph}
        </Text>
      ))}
      {message.attachment ? (
        <Card colors={{ containerColor: colors.surfaceContainerHigh }}>
          <Row
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(12)]}>
            <Icon source={Description} size={28} tint="#FF3B30" />
            <Column>
              <Text color={colors.onSurface} style={{ typography: 'titleSmall' }}>
                {message.attachment.name}
              </Text>
              <Text color={colors.onSurfaceVariant} style={{ typography: 'labelMedium' }}>
                {message.attachment.size}
              </Text>
            </Column>
          </Row>
        </Card>
      ) : null}
    </Column>
  );
}
