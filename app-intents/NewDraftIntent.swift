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
  static let description = IntentDescription(
    "Writes a draft in the SDK 58 mail client from one sentence.")

  /// Siri asks its question first and opens the app only at the end, on the finished draft.
  /// Before iOS 26, the intent runs in the background, and the draft is in Drafts the next time
  /// the app opens.
  @available(iOS 26.0, *)
  static var supportedModes: IntentModes { .foreground(.deferred) }

  // One answer holds the whole email, for example "tell Maya the split view works and ask her to
  // film the fold tomorrow". A phrase cannot carry free text, so Siri asks for it once.
  @Parameter(
    title: "Email",
    inputOptions: String.IntentInputOptions(multiline: true),
    requestValueDialog: "Who is it for, and what should it say?"
  )
  var request: String

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    // Apple's on-device model splits the request into a recipient, a subject, and a body.
    let draft = await DraftWriter.write(from: request)

    await AppIntentDispatcher.shared.dispatch(
      name: "createMailDraft",
      params: [
        "id": .string(UUID().uuidString),
        "subject": .string(draft.subject),
        "body": .string(draft.body),
        "recipients": .array(draft.recipient.isEmpty ? [] : [.string(draft.recipient)]),
        "attachmentCount": .int(0),
      ]
    )

    // Opens the app on the draft, with no "Continue in SDK 58?" question first.
    if #available(iOS 26.0, *) {
      try await continueInForeground(alwaysConfirm: false)
    }

    let dialog: IntentDialog =
      draft.recipient.isEmpty ? "Your draft is ready." : "Your draft to \(draft.recipient) is ready."
    return .result(dialog: dialog)
  }
}
