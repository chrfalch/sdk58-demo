// from expo's bare-expo benchmarking module (mit),
// apps/bare-expo/modules/benchmarking/android/.../BenchmarkingTurboPackage.kt at c35f5fe7c8a.
package expo.modules.nativerace.turbo

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeRaceTurboPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      NativeRaceTurboSpec.NAME -> NativeRaceTurboModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeRaceTurboSpec.NAME to ReactModuleInfo(
        NativeRaceTurboSpec.NAME,
        NativeRaceTurboSpec.NAME,
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // isCxxModule
        true // isTurboModule
      )
    )
  }
}
