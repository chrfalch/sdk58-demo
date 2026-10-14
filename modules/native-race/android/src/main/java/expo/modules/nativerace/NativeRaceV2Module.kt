// the expo modules 2.0 syntax is from expo's bare-expo expo-v2-demo module (mit),
// apps/bare-expo/modules/expo-v2-demo/android/.../ExpoV2Demo.kt at c35f5fe7c8a.
// kotlin modules 2.0 extend a different Module class, so the @JS function lives in its own
// module instead of beside the DSL function, as it does in swift.
package expo.modules.nativerace

import io.github.expo.modules.v2.ExpoModule
import io.github.expo.modules.v2.JS
import io.github.expo.modules.v2.Module

// The new way: an ordinary Kotlin method, exposed to JavaScript with @JS.
@ExpoModule("NativeRaceV2")
class NativeRaceV2Module : Module() {
  @JS
  fun addNumbers(a: Double, b: Double): Double = a + b
}
