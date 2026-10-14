// from expo's bare-expo benchmarking module (mit), apps/bare-expo/modules/benchmarking/src/
// BenchmarkingExpoModule.ts at c35f5fe7c8a, cut down to one function written in each api.
import { NativeModule, requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import NativeRaceTurbo from '../native-race-turbo/src/NativeRaceTurbo';

declare class NativeRaceModule extends NativeModule {
  /** `Function("addNumbers")` in the module definition DSL, in swift and in kotlin. */
  addNumbers(a: number, b: number): number;
  /** ios only: `@JS func addNumbersSynthesized`, in the same swift class. */
  addNumbersSynthesized(a: number, b: number): number;
}

declare class NativeRaceV2Module extends NativeModule {
  /** android only: `@JS fun addNumbers`, in its own kotlin class. */
  addNumbers(a: number, b: number): number;
}

const NativeRace = requireOptionalNativeModule<NativeRaceModule>('NativeRace');
const NativeRaceV2 = requireOptionalNativeModule<NativeRaceV2Module>('NativeRaceV2');

/** one way to call the same native function. the race times `call`. */
export type Racer = { name: string; call: () => void };

function findRacers(): Racer[] | null {
  if (!NativeRace) return null;
  const dsl: Racer = {
    name: 'Function DSL',
    call: () => {
      NativeRace.addNumbers(2, 5);
    },
  };
  if (Platform.OS === 'ios') {
    const js: Racer = {
      name: '@JS',
      call: () => {
        NativeRace.addNumbersSynthesized(2, 5);
      },
    };
    return [dsl, js];
  }
  // the changelog also measures react native's turbomodules, on android only.
  // an import does not stay narrowed inside the call below, so it gets a local name.
  const turboModule = NativeRaceTurbo;
  if (!NativeRaceV2 || !turboModule) return null;
  const js: Racer = {
    name: '@JS',
    call: () => {
      NativeRaceV2.addNumbers(2, 5);
    },
  };
  const turbo: Racer = {
    name: 'TurboModule',
    call: () => {
      turboModule.addNumbers(2, 5);
    },
  };
  return [dsl, js, turbo];
}

/** null when the native modules are missing, such as in a build without them. */
export const racers = findRacers();
