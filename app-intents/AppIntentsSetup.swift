internal import ExpoAppIntents
internal import ExpoModulesCore

/// Registered Expo inline module that wires app-target App Intents code to expo-app-intents.
/// Do not change the name of this class.
final class AppIntentsSetup: Module {
  public func definition() -> ExpoModulesCore.ModuleDefinition {
    Name("AppIntentsSetup")

    // Connects AppShortcuts to the expo-app-intents runtime, as in
    // apps/native-component-list/app-intents/AppIntentsSetup.swift.
    OnCreate {
      Task {
        await AppIntentDispatcher.shared.setShortcutsRefreshHandler {
          AppShortcuts.updateAppShortcutParameters()
        }
        AppShortcuts.updateAppShortcutParameters()
      }

      // From `expo-app-intents init --examples mail --visual-intelligence` (0.5.5): the drafts that
      // JavaScript publishes as the `mailDraft` catalog go into Spotlight, and a draft on screen can
      // carry its identifier, so Siri can act on the draft you are looking at.
      if #available(iOS 18.0, macOS 15.0, *) {
        AppEntityIdentifierRegistry.shared.registerIndexed("mailDraft", as: MailDraftEntity.self)
      }
    }
  }
}
