// cut down from expo's bare-expo benchmarking module (mit),
// apps/bare-expo/modules/benchmarking/android/.../BenchmarkingExpoModule.kt at c35f5fe7c8a.
package expo.modules.nativerace

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// The old way: describe the function inside the definition DSL.
class NativeRaceModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeRace")

    Function("addNumbers") { a: Double, b: Double ->
      a + b
    }
  }
}
