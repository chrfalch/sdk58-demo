// the native race on android: the same kotlin function in the module DSL, with @JS, and as a react
// native turbomodule, because the sdk 58 changelog measures all three on android. the race itself
// is in race.ts. the rows follow the grouped list of the android mail tab.
import FlagIcon from '@expo/material-symbols/flag.xml';
import {
  Button,
  Column,
  Host,
  Icon,
  ListItem,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  clip,
  fillMaxSize,
  fillMaxWidth,
  padding,
  Shapes,
  verticalScroll,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  compareToJS,
  DEBUG_NOTE,
  ITERATIONS,
  milliseconds,
  racers,
  runRace,
  WHERE,
  type Lap,
  type Racer,
} from './race';

// how the verdict names each racer: "@JS is 4.0× faster than the DSL".
const THAN: Record<string, string> = { 'Function DSL': 'the DSL', TurboModule: 'a TurboModule' };

export default function NativeRaceScreen() {
  const colors = useMaterialColors();
  return (
    <Host style={{ flex: 1 }}>
      <Surface color={colors.background} modifiers={[fillMaxSize()]}>
        {racers ? (
          <Race racers={racers} />
        ) : (
          // the safety net for a build without the native modules.
          <Text
            color={colors.onSurfaceVariant}
            style={{ typography: 'bodyLarge', textAlign: 'center' }}
            modifiers={[padding(32, 32, 32, 32)]}>
            This build has no native race modules.
          </Text>
        )}
      </Surface>
    </Host>
  );
}

// Material 3 "grouped list" corners: only the outer corners are round.
function corners(first: boolean, last: boolean) {
  const top = first ? 24 : 6;
  const bottom = last ? 24 : 6;
  return { topStart: top, topEnd: top, bottomStart: bottom, bottomEnd: bottom };
}

function Race({ racers }: { racers: Racer[] }) {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();
  const [laps, setLaps] = useState<Lap[] | null>(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // the loops block the JS thread, so the button shows "Running" first.
    setTimeout(() => {
      setLaps(runRace(racers));
      setRunning(false);
    }, 50);
  };

  return (
    <Column
      verticalArrangement={{ spacedBy: 16 }}
      modifiers={[fillMaxSize(), verticalScroll(), padding(16, 8, 16, 16 + insets.bottom)]}>
      <Text color={colors.onSurfaceVariant} style={{ typography: 'titleSmall' }}>
        {`${ITERATIONS.toLocaleString()} calls to addNumbers(2, 5)`}
      </Text>
      <Column verticalArrangement={{ spacedBy: 3 }} modifiers={[fillMaxWidth()]}>
        {racers.map((racer, index) => (
          <ListItem
            key={racer.name}
            colors={{
              containerColor: colors.surfaceContainerHigh,
              contentColor: colors.onSurface,
              trailingContentColor: colors.onSurfaceVariant,
            }}
            modifiers={[
              fillMaxWidth(),
              clip(Shapes.RoundedCorner(corners(index === 0, index === racers.length - 1))),
            ]}>
            <ListItem.HeadlineContent>
              <Text style={{ typography: 'titleMedium' }}>{racer.name}</Text>
            </ListItem.HeadlineContent>
            <ListItem.TrailingContent>
              <Text style={{ typography: 'bodyLarge', fontFamily: 'monospace' }}>
                {milliseconds(laps?.find((lap) => lap.name === racer.name)?.ms)}
              </Text>
            </ListItem.TrailingContent>
          </ListItem>
        ))}
      </Column>
      {laps ? (
        <Column verticalArrangement={{ spacedBy: 4 }}>
          <Text color={colors.onSurfaceVariant} style={{ typography: 'titleMedium' }}>
            @JS is
          </Text>
          {compareToJS(laps).map((other) => (
            <Text
              key={other.name}
              color={colors.onSurface}
              style={{ typography: 'headlineSmall', fontWeight: '700' }}>
              {other.times >= 1
                ? `${other.times.toFixed(1)}× faster than ${THAN[other.name] ?? other.name}`
                : `${(1 / other.times).toFixed(1)}× slower than ${THAN[other.name] ?? other.name}`}
            </Text>
          ))}
        </Column>
      ) : null}
      <Button onClick={run} enabled={!running} modifiers={[fillMaxWidth()]}>
        <Icon source={FlagIcon} size={18} />
        <Text modifiers={[padding(8, 0, 0, 0)]}>
          {running ? 'Running' : laps ? 'Run again' : 'Run the race'}
        </Text>
      </Button>
      <Text color={colors.onSurfaceVariant} style={{ typography: 'bodySmall' }}>
        {`Measured here: ${WHERE}${DEBUG_NOTE}`}
      </Text>
    </Column>
  );
}
