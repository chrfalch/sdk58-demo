export type InboxWidgetMessage = { id: string; sender: string; subject: string };

/** what the app sends the inbox widget: the unread count and the unread messages, newest first. */
export type InboxWidgetProps = { unread: number; messages: InboxWidgetMessage[] };
