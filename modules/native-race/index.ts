// from expo's bare-expo benchmarking module (mit), apps/bare-expo/modules/benchmarking/src/
// BenchmarkingExpoModule.ts at c35f5fe7c8a, cut down to one function pair.
import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class NativeRaceModule extends NativeModule {
  /** `Function("addNumbers")` in the module definition DSL. */
  addNumbers(a: number, b: number): number;
  /** `@JS func addNumbersSynthesized`, bound at build time by Expo Modules 2.0. */
  addNumbersSynthesized(a: number, b: number): number;
}

// optional, because the module is swift only: on android this is null instead of a crash.
export default requireOptionalNativeModule<NativeRaceModule>('NativeRace');
