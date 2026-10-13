// the android counterpart of nathan's swiftui hinge demo (index.tsx): the same readings and
// session stats, in material 3. it reuses his use-hinge-session.ts. android reports the hinge
// only while the window spans the fold, and never reports "closed" (see the expo-hinge docs).
import {
  Card,
  type CardProps,
  Column,
  Host,
  ListItem,
  Row,
  Surface,
  Text,
  TextButton,
  useMaterialColors,
  type MaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxHeight,
  fillMaxSize,
  fillMaxWidth,
  paddingAll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useHinge, type HingeStatus } from 'expo-hinge';
import { useWindowDimensions } from 'react-native';

import { useHingeSession, type HingeSession } from './use-hinge-session';

const postures: Record<HingeStatus, string> = {
  closed: 'Closed',
  partiallyOpen: 'Partially open',
  fullyOpen: 'Fully open',
  unknown: 'Unknown',
};

export default function HingeScreen() {
  const hinge = useHinge();
  const { session, reset } = useHingeSession();
  const colors = useMaterialColors();
  // unfolded, the readings sit beside the angle, as the arrangement does on the duo.
  const wide = useWindowDimensions().width >= 600;
  const posture = hinge ? postures[hinge.status] : 'No reading';

  const angle = (
    <Card
      colors={{ containerColor: colors.surfaceContainerHigh, contentColor: colors.onSurface }}
      modifiers={wide ? [weight(1), fillMaxHeight()] : [fillMaxWidth()]}>
      <Column
        horizontalAlignment="center"
        verticalArrangement="center"
        modifiers={[wide ? fillMaxSize() : fillMaxWidth(), paddingAll(24)]}>
        <Text color={colors.onSurfaceVariant} style={{ typography: 'labelLarge' }}>
          Hinge angle
        </Text>
        <Text style={{ fontSize: 96, fontWeight: '300' }}>
          {hinge ? `${Math.round(hinge.angle)}°` : '-'}
        </Text>
        <Text color={colors.onSurfaceVariant} style={{ typography: 'titleMedium' }}>
          {posture}
        </Text>
      </Column>
    </Card>
  );

  const readings = (
    <SessionCard
      session={session}
      onReset={reset}
      colors={colors}
      modifiers={wide ? [weight(1), fillMaxHeight()] : [fillMaxWidth()]}
    />
  );

  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        {wide ? (
          <Row horizontalArrangement={{ spacedBy: 16 }} modifiers={[fillMaxSize(), paddingAll(16)]}>
            {angle}
            {readings}
          </Row>
        ) : (
          <Column
            verticalArrangement={{ spacedBy: 16 }}
            modifiers={[fillMaxSize(), paddingAll(16)]}>
            {angle}
            {readings}
          </Column>
        )}
      </Surface>
    </Host>
  );
}

function SessionCard({
  session,
  onReset,
  colors,
  modifiers,
}: {
  session: HingeSession;
  onReset: () => void;
  colors: MaterialColors;
  modifiers: CardProps['modifiers'];
}) {
  const listColors = { containerColor: colors.surfaceContainerHigh };
  const value = (v: number | null) => (v === null ? 'No samples' : `${v.toFixed(1)}°`);
  return (
    <Card colors={{ containerColor: colors.surfaceContainerHigh }} modifiers={modifiers}>
      <Column modifiers={[fillMaxWidth(), paddingAll(8)]}>
        <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'titleSmall' }}
            modifiers={[weight(1), paddingAll(8)]}>
            This session
          </Text>
          <TextButton onClick={onReset}>
            <Text>Reset</Text>
          </TextButton>
        </Row>
        <ListItem colors={listColors}>
          <ListItem.HeadlineContent>
            <Text>Lowest</Text>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Text>{value(session.minimum)}</Text>
          </ListItem.TrailingContent>
        </ListItem>
        <ListItem colors={listColors}>
          <ListItem.HeadlineContent>
            <Text>Highest</Text>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Text>{value(session.maximum)}</Text>
          </ListItem.TrailingContent>
        </ListItem>
        <ListItem colors={listColors}>
          <ListItem.HeadlineContent>
            <Text>Events</Text>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Text>{session.events.toLocaleString()}</Text>
          </ListItem.TrailingContent>
        </ListItem>
      </Column>
    </Card>
  );
}
