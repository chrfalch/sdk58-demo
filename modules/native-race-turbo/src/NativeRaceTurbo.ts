// cut down from expo's bare-expo benchmarking module (mit),
// apps/bare-expo/modules/benchmarking/src/NativeBenchmarkingTurboModule.ts at c35f5fe7c8a.
// react native's codegen reads this spec and writes the java and c++ glue at build time.
import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  addNumbers(a: number, b: number): number;
}

// android only: on ios this is null.
export default TurboModuleRegistry.get<Spec>('NativeRaceTurbo');
