import InfoIcon from '@expo/material-symbols/info.xml';
import OpenInNewIcon from '@expo/material-symbols/open_in_new.xml';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { changelogUrl, type Demo } from './registry';

export function openChangelog(demo: Demo) {
  void WebBrowser.openBrowserAsync(changelogUrl(demo.changelog));
}

// android toolbars draw only image icons, not sf symbols, so android uses material symbols.
const icons =
  Platform.OS === 'ios'
    ? ({ info: 'info.circle', open: 'safari' } as const)
    : { info: InfoIcon, open: OpenInNewIcon };

/** the info button of a demo screen: its changelog label, and a link to its changelog section. */
export function DemoToolbar({ demo }: { demo: Demo }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={icons.info}
        accessibilityLabel="About this demo"
        title={`${demo.status} in Expo SDK 58`}>
        <Stack.Toolbar.MenuAction
          icon={icons.open}
          subtitle={demo.changelog.title}
          onPress={() => openChangelog(demo)}>
          {/* android menus show no title, so the label goes into the action there. */}
          {Platform.OS === 'ios'
            ? 'Read the changelog'
            : `${demo.status} in SDK 58: read the changelog`}
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
