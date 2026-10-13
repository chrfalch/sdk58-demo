// cut down from expo's bare-expo benchmarking module (mit),
// apps/bare-expo/modules/benchmarking/ios/BenchmarkingExpoModule.swift at c35f5fe7c8a.
// the same swift function, written twice: once in the module definition dsl, and once as a
// plain method marked @JS, which expo modules 2.0 binds at build time.
import ExpoModulesCore
import ExpoModulesJSI

@ExpoModule("NativeRace")
public final class NativeRaceModule: Module {
  // The old way: describe the function inside the definition DSL.
  public func definition() -> ModuleDefinition {
    Function("addNumbers") { (a: Double, b: Double) in
      return a + b
    }
  }

  // The new way: an ordinary Swift method, exposed to JavaScript with @JS.
  @JS
  private func addNumbersSynthesized(a: Double, b: Double) throws -> Double {
    return a + b
  }
}
