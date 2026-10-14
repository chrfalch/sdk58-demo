// the timing loop (timeSync, 100,000 calls, one warm-up call first) is copied from expo's
// native-component-list (mit), src/screens/ModulesCore/Benchmarks/benchmarks.ts at c35f5fe7c8a.
// the modules are in modules/native-race and modules/native-race-turbo.
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import type { Racer } from '../../../modules/native-race';

export { racers, type Racer } from '../../../modules/native-race';

export const ITERATIONS = 100_000;

function timeSync(iterations: number, fn: () => void): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  return performance.now() - start;
}

export type Lap = { name: string; ms: number };

/** calls each racer once to warm it up, then times ITERATIONS calls. this blocks the JS thread. */
export function runRace(racers: Racer[]): Lap[] {
  return racers.map((racer) => {
    racer.call();
    return { name: racer.name, ms: timeSync(ITERATIONS, racer.call) };
  });
}

/** how many times faster @JS is than each other racer. below 1 means slower. */
export function compareToJS(laps: Lap[]): { name: string; times: number }[] {
  const js = laps.find((lap) => lap.name === '@JS');
  if (!js) return [];
  return laps.filter((lap) => lap !== js).map((lap) => ({ name: lap.name, times: lap.ms / js.ms }));
}

// where the numbers come from, so the screen never claims more than it measured. an ios
// simulator's model name is "Simulator iOS", and its device name is the simulator's name, such as
// "iPhone Duo". an android emulator's model and device names are both "sdk_gphone64_arm64".
// the text does not say where the simulator runs: it can be on this mac or in eas simulator.
const DEVICE = Device.isDevice
  ? (Device.modelName ?? 'this device')
  : Platform.OS === 'ios'
    ? `${Device.deviceName ?? 'iOS'} simulator`
    : `Android ${Device.osVersion ?? ''} emulator`;

export const WHERE = `${__DEV__ ? 'Debug' : 'Release'} build, ${DEVICE}.`;
export const DEBUG_NOTE = __DEV__
  ? ' A debug build is slower: run a release build for fair numbers.'
  : '';

export function milliseconds(value: number | undefined) {
  return value === undefined ? 'Not run' : `${value.toFixed(1)} ms`;
}
