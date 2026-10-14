// from "handle the mail example" in the expo-app-intents sdk 58 docs
// (docs/pages/versions/v58.0.0/sdk/app-intents.mdx at expo/expo c35f5fe7c8a). the swift side is
// app-intents/, written by `expo-app-intents init --examples mail --visual-intelligence`.
import * as AppIntents from 'expo-app-intents';
import { useEffect, useRef } from 'react';

import type { Message } from './mail-data';

export type IntentDraft = { id: string; subject: string; body: string; to?: string };

/**
 * calls `onDraft` once for each draft that siri, shortcuts, or apple intelligence creates, and
 * `onOpen` with the id of a draft that the system opens, for example from a spotlight result.
 */
export function useDraftIntents({
  onDraft,
  onOpen,
}: {
  onDraft: (draft: IntentDraft) => void;
  onOpen: (id: string) => void;
}) {
  // delivery is at-least-once, so the same invocation can arrive more than once.
  const handledIds = useRef(new Set<string>());

  AppIntents.useAppIntents(async (pendingIntents) => {
    for (const invocation of pendingIntents) {
      if (handledIds.current.has(invocation.id)) continue;

      if (invocation.name === 'createMailDraft') {
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
      } else if (invocation.name === 'openMailDraft') {
        // OpenMailDraftIntent.swift, the mail domain's `.mail.openDraft` schema (ios 27).
        onOpen(String(invocation.params.id));
      } else {
        continue;
      }

      handledIds.current.add(invocation.id);
      await AppIntents.removePendingInvocationAsync(invocation.id);
    }
  });
}

/**
 * publishes the drafts as the `mailDraft` catalog whenever they change. siri resolves a draft you
 * name from it, AppIntentsSetup.swift mirrors it into spotlight, and the open draft's
 * `appEntityIdentifier` points into it.
 */
export function useDraftCatalog(drafts: Message[]) {
  // the catalog as a string, so the effect runs only when a draft really changes.
  const catalog = JSON.stringify(
    drafts.map(
      (draft): AppIntents.AppIntentEntity => ({
        id: draft.id,
        // siri cannot resolve an entity with an empty title, and the store rejects the catalog.
        title: draft.subject.trim() || 'No Subject',
        subtitle: draft.body.join('\n'),
        // MailDraftEntity.swift reads the recipients as a json array.
        metadata: { recipients: JSON.stringify(draft.to ? [draft.to] : []) },
      })
    )
  );

  useEffect(() => {
    if (!AppIntents.isAvailable()) return;
    AppIntents.setEntityCatalogAsync('mailDraft', JSON.parse(catalog)).catch((error: unknown) =>
      console.warn('could not publish the drafts to siri and spotlight', error)
    );
  }, [catalog]);
}
