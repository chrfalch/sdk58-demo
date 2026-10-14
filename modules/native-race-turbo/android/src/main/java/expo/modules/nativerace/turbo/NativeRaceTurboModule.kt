// cut down from expo's bare-expo benchmarking module (mit),
// apps/bare-expo/modules/benchmarking/android/.../BenchmarkingTurboModule.kt at c35f5fe7c8a.
// NativeRaceTurboSpec is written by react native's codegen from src/NativeRaceTurbo.ts.
package expo.modules.nativerace.turbo

import com.facebook.react.bridge.ReactApplicationContext

class NativeRaceTurboModule(reactContext: ReactApplicationContext) : NativeRaceTurboSpec(reactContext) {
  override fun addNumbers(a: Double, b: Double): Double {
    return a + b
  }
}
