import AppIntents

/// All App Shortcuts for this app. Phrases are compiled into the app and cannot be created
/// at runtime. Required parameters that are not in the launch phrase are collected by Siri
/// as follow-up questions.
///
/// System rules:
/// - Every phrase must include \(.applicationName) or the phrase is dropped at build time.
/// - At most 10 App Shortcuts per app. Apple recommends 2-5.
///
/// From apps/native-component-list/app-intents/AppShortcuts.swift in expo/expo at c35f5fe7c8a.
struct AppShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: NewDraftIntent(),
      phrases: [
        "New draft in \(.applicationName)",
        "Start a draft in \(.applicationName)",
      ],
      shortTitle: "New Draft",
      systemImageName: "square.and.pencil"
    )
  }
}
