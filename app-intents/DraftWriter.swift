import Foundation
#if canImport(FoundationModels)
import FoundationModels
#endif

/// A draft written from one spoken request.
struct WrittenDraft {
  var recipient: String
  var subject: String
  var body: String
}

/// Turns one spoken request, such as "tell Maya the split view works and ask her to film the fold
/// tomorrow", into a draft: who it is for, a subject, and a short body. It uses Apple's on-device
/// model (Foundation Models, iOS 26 and later, on a device with Apple Intelligence on). Without the
/// model, the request itself becomes the body.
///
/// This is our own code, not part of expo-app-intents: Siri's "email Maya ..." requests go to
/// Apple's Mail app, so the app asks for the whole email in one answer and writes the draft itself.
enum DraftWriter {
  static func write(from request: String) async -> WrittenDraft {
    #if canImport(FoundationModels)
    if #available(iOS 26.0, *), case .available = SystemLanguageModel.default.availability,
      let draft = try? await generate(from: request)
    {
      return draft
    }
    #endif
    return WrittenDraft(recipient: "", subject: "New draft", body: request)
  }

  #if canImport(FoundationModels)
  @available(iOS 26.0, *)
  private static func generate(from request: String) async throws -> WrittenDraft {
    let session = LanguageModelSession(
      instructions: """
        You turn a spoken request into a short work email from Rami. Use only the facts in the \
        request. Do not invent names, dates, places, or details.
        """
    )
    let draft = try await session.respond(to: request, generating: GeneratedDraft.self).content
    return WrittenDraft(recipient: draft.recipient, subject: draft.subject, body: draft.body)
  }
  #endif
}

#if canImport(FoundationModels)
@available(iOS 26.0, *)
@Generable
private struct GeneratedDraft {
  @Guide(description: "Who the email is for, as the name in the request. Empty when the request names nobody.")
  var recipient: String

  @Guide(description: "A subject line of two to six words.")
  var subject: String

  @Guide(
    description: "The email body: a greeting with the recipient's first name, two or three short sentences, then the sign-off \"Rami\" on its own line."
  )
  var body: String
}
#endif
