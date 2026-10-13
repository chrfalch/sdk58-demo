// from "handle the mail example" in the expo-app-intents sdk 58 docs
// (docs/pages/versions/v58.0.0/sdk/app-intents.mdx at expo/expo c35f5fe7c8a). the swift side is
// app-intents/CreateDraftIntent.swift, written by `expo-app-intents init --examples mail`.
import * as AppIntents from 'expo-app-intents';
import { useRef } from 'react';

export type IntentDraft = { id: string; subject: string; body: string; to?: string };

/** calls `onDraft` once for each draft that siri, shortcuts, or apple intelligence creates. */
export function useDraftIntents(onDraft: (draft: IntentDraft) => void) {
  // delivery is at-least-once, so the same invocation can arrive more than once.
  const handledIds = useRef(new Set<string>());

  AppIntents.useAppIntents(async (pendingIntents) => {
    for (const invocation of pendingIntents) {
      if (invocation.name !== 'createMailDraft' || handledIds.current.has(invocation.id)) {
        continue;
      }
      handledIds.current.add(invocation.id);

      const body = String(invocation.params.body ?? '');
      const recipients = Array.isArray(invocation.params.recipients)
        ? invocation.params.recipients.map(String)
        : [];
      onDraft({
        id: String(invocation.params.id || invocation.id),
        // Use `||`, not `??`: a draft with no subject arrives as an empty string.
        subject: String(invocation.params.subject || body.slice(0, 40) || 'No Subject'),
        body,
        to: recipients.length > 0 ? recipients.join(', ') : undefined,
      });

      await AppIntents.removePendingInvocationAsync(invocation.id);
    }
  });
}
