// the native race on ios: the same swift function in the module DSL and with @JS. the race itself
// is in race.ts, and index.android.tsx adds a turbomodule on android.
import { Host } from '@expo/ui';
import { Button, Form, LabeledContent, Section, Text as SwiftUIText } from '@expo/ui/swift-ui';
import { disabled, font, foregroundStyle, monospacedDigit } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useSystemColors } from '@/hooks/use-system-colors';

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

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });

export default function NativeRaceScreen() {
  // the safety net for a build without the native module.
  if (!racers) return <Unavailable />;
  return <Race racers={racers} />;
}

function Unavailable() {
  const colors = useSystemColors();
  return (
    <View style={[styles.unavailable, { backgroundColor: colors.background }]}>
      <Text style={[styles.unavailableText, { color: colors.secondaryLabel }]}>
        This build has no native race module.
      </Text>
    </View>
  );
}

function Race({ racers }: { racers: Racer[] }) {
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

  const dsl = laps ? compareToJS(laps).find((other) => other.name === 'Function DSL') : undefined;

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          title={`${ITERATIONS.toLocaleString()} calls to addNumbers(2, 5)`}
          footer={<SwiftUIText>{`Measured here: ${WHERE}${DEBUG_NOTE}`}</SwiftUIText>}>
          {racers.map((racer) => (
            <LabeledContent key={racer.name} label={racer.name}>
              <SwiftUIText modifiers={[monospacedDigit(), secondary]}>
                {milliseconds(laps?.find((lap) => lap.name === racer.name)?.ms)}
              </SwiftUIText>
            </LabeledContent>
          ))}
          {dsl ? (
            <SwiftUIText
              modifiers={[font({ textStyle: 'title', weight: 'bold' }), monospacedDigit()]}>
              {dsl.times >= 1
                ? `@JS is ${dsl.times.toFixed(1)}× faster`
                : `@JS is ${(1 / dsl.times).toFixed(1)}× slower`}
            </SwiftUIText>
          ) : null}
        </Section>
        <Section>
          <Button
            label={running ? 'Running' : laps ? 'Run again' : 'Run the race'}
            systemImage="flag.checkered"
            onPress={run}
            modifiers={[disabled(running)]}
          />
        </Section>
      </Form>
    </Host>
  );
}

const styles = StyleSheet.create({
  unavailable: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  unavailableText: { fontSize: 17, textAlign: 'center' },
});
