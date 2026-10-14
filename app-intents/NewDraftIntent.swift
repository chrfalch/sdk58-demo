import AppIntents
internal import ExpoAppIntents
import Foundation

/// A plain intent with a launch phrase, so classic Siri and Spotlight can start a draft too.
/// `CreateDraftIntent` adopts the `.mail.createDraft` schema for Apple Intelligence, and a schema
/// intent has no phrase of its own. Both send the same `createMailDraft` invocation, so the
/// JavaScript side handles them the same way.
///
/// Based on the `SaveNoteIntent` example in the expo-app-intents SDK 58 docs.
struct NewDraftIntent: AppIntent {
  static let title: LocalizedStringResource = "New Draft"
  static let description = IntentDescription("Writes a draft in the SDK 58 mail client.")

  /// Siri asks its questions first and opens the app only at the end, on the finished draft.
  /// Before iOS 26, the intent runs in the background, and the draft is in Drafts the next time
  /// the app opens.
  @available(iOS 26.0, *)
  static var supportedModes: IntentModes { .foreground(.deferred) }

  // Siri asks for each required parameter in this order: who, what about, then what to say.
  @Parameter(title: "To", requestValueDialog: "Who is it for?")
  var recipient: String

  @Parameter(title: "Subject", requestValueDialog: "What's the subject?")
  var subject: String

  @Parameter(
    title: "Message",
    inputOptions: String.IntentInputOptions(multiline: true),
    requestValueDialog: "What do you want to say?"
  )
  var message: String

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "createMailDraft",
      params: [
        "id": .string(UUID().uuidString),
        "subject": .string(subject),
        "body": .string(message),
        "recipients": .array([.string(recipient)]),
        "attachmentCount": .int(0),
      ]
    )

    // Opens the app on the draft, with no "Continue in SDK 58?" question first.
    if #available(iOS 26.0, *) {
      try await continueInForeground(alwaysConfirm: false)
    }

    return .result(dialog: "Your draft to \(recipient) is ready.")
  }
}
