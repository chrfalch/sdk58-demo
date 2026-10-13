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
  static let description = IntentDescription("Starts a draft in the SDK 58 mail client.")
  static let openAppWhenRun = true

  @Parameter(title: "Subject", requestValueDialog: "What's the subject?")
  var subject: String

  @MainActor
  func perform() async throws -> some IntentResult {
    await AppIntentDispatcher.shared.dispatch(
      name: "createMailDraft",
      params: [
        "id": .string(UUID().uuidString),
        "subject": .string(subject),
        "body": .string(""),
        "recipients": .array([]),
        "attachmentCount": .int(0),
      ]
    )

    return .result()
  }
}
