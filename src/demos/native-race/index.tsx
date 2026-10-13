// the timing loop (timeSync, 100,000 calls, one warm-up call first) is copied from expo's
// native-component-list (mit), src/screens/ModulesCore/Benchmarks/benchmarks.ts at c35f5fe7c8a.
// the module is in modules/native-race.
import { Host } from '@expo/ui';
import { Button, Form, LabeledContent, Section, Text } from '@expo/ui/swift-ui';
import { disabled, font, foregroundStyle, monospacedDigit } from '@expo/ui/swift-ui/modifiers';
import * as Device from 'expo-device';
import { useState } from 'react';

import NativeRace from '../../../modules/native-race';

const ITERATIONS = 100_000;

function timeSync(iterations: number, fn: () => void): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

type Result = { dsl: number; js: number };

// where the numbers come from, so the screen never claims more than it measured. a simulator's
// model name is "Simulator iOS", and its device name is the simulator's name, such as "iPhone Duo".
const DEVICE = Device.isDevice
  ? (Device.modelName ?? 'this iPhone')
  : `${Device.deviceName ?? 'iOS'} simulator on this Mac`;
const WHERE = `${__DEV__ ? 'Debug' : 'Release'} build, ${DEVICE}.`;
const DEBUG_NOTE = __DEV__ ? ' A debug build is slower: run a release build for fair numbers.' : '';

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });

export default function NativeRaceScreen() {
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // the loops block the JS thread, so the button shows "Running" first.
    setTimeout(() => {
      NativeRace.addNumbers(0, 1);
      const dsl = timeSync(ITERATIONS, () => {
        NativeRace.addNumbers(2, 5);
      });
      NativeRace.addNumbersSynthesized(0, 1);
      const js = timeSync(ITERATIONS, () => {
        NativeRace.addNumbersSynthesized(2, 5);
      });
      setResult({ dsl, js });
      setRunning(false);
    }, 50);
  };

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          title={`${ITERATIONS.toLocaleString()} calls to addNumbers(2, 5)`}
          footer={<Text>{`Measured here: ${WHERE}${DEBUG_NOTE}`}</Text>}>
          <LabeledContent label="Function DSL">
            <Text modifiers={[monospacedDigit(), secondary]}>{milliseconds(result?.dsl)}</Text>
          </LabeledContent>
          <LabeledContent label="@JS">
            <Text modifiers={[monospacedDigit(), secondary]}>{milliseconds(result?.js)}</Text>
          </LabeledContent>
          {result ? (
            <Text modifiers={[font({ textStyle: 'title', weight: 'bold' }), monospacedDigit()]}>
              {`@JS is ${(result.dsl / result.js).toFixed(1)}× faster`}
            </Text>
          ) : null}
        </Section>
        <Section>
          <Button
            label={running ? 'Running' : result ? 'Run again' : 'Run the race'}
            systemImage="flag.checkered"
            onPress={run}
            modifiers={[disabled(running)]}
          />
        </Section>
      </Form>
    </Host>
  );
}

function milliseconds(value: number | undefined) {
  return value === undefined ? 'Not run' : `${value.toFixed(1)} ms`;
}
