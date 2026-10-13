import { addUserInteractionListener } from 'expo-widgets';
import { useEffect } from 'react';
import { AppState, Platform, useColorScheme } from 'react-native';

import { messagesIn, type Message } from '@/demos/mail/mail-data';

import InboxWidget from './inbox-widget';

/**
 * keeps the inbox widget in step with the mail tab: every change to the inbox becomes the
 * widget's snapshot, and "mark all read" on the widget marks the inbox read in the app.
 */
export function useInboxWidget(messages: Message[], onMarkAllRead: () => void) {
  useEffect(() => {
    const unread = messagesIn('inbox', messages).filter((m) => m.unread);
    InboxWidget.updateSnapshot({
      unread: unread.length,
      messages: unread.map(({ id, sender, subject }) => ({ id, sender, subject })),
    });
  }, [messages]);

  // the android widget reads its material colors when it renders, and nothing re-renders it when
  // the system switches between light and dark. so the app re-renders it when it sees the switch.
  const colorScheme = useColorScheme();
  useEffect(() => {
    InboxWidget.reload();
  }, [colorScheme]);

  // android delivers the widget's button tap to the running app.
  useEffect(() => {
    const listen = () =>
      addUserInteractionListener((event) => {
        if (event.source === 'InboxWidget' && event.target === 'markAllRead') onMarkAllRead();
      });
    let subscription = listen();
    // in a development build, a reload can drop the listener: the old copy of the module stops
    // the observer after the new copy starts it. listening again whenever the app leaves the
    // screen keeps it in place before anyone can tap the widget.
    const appState = AppState.addEventListener('change', (state) => {
      if (state !== 'background') return;
      subscription.remove();
      subscription = listen();
    });
    return () => {
      appState.remove();
      subscription.remove();
    };
  }, [onMarkAllRead]);

  // ios runs the button in the widget extension, so the app never hears the tap. the tap writes
  // the widget's new props into its timeline, so the app reads it when it comes back: a widget
  // that says 0 unread while the app has unread mail was marked read on the home screen.
  const hasUnread = messagesIn('inbox', messages).some((m) => m.unread);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state !== 'active' || !hasUnread) return;
      const entries = await InboxWidget.getTimeline();
      if (entries.at(-1)?.props.unread === 0) onMarkAllRead();
    });
    return () => subscription.remove();
  }, [hasUnread, onMarkAllRead]);
}
