import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { changelogUrl, type Demo } from './registry';

export function openChangelog(demo: Demo) {
  void WebBrowser.openBrowserAsync(changelogUrl(demo.changelog));
}

/** the info button of a demo screen: its changelog label, and a link to its changelog section. */
export function DemoToolbar({ demo }: { demo: Demo }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon="info.circle"
        accessibilityLabel="About this demo"
        title={`${demo.status} in Expo SDK 58`}>
        <Stack.Toolbar.MenuAction
          icon="safari"
          subtitle={demo.changelog.title}
          onPress={() => openChangelog(demo)}>
          Read the changelog
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
