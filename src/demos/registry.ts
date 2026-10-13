import type { Href } from 'expo-router';
import type { ComponentType } from 'react';
import type { SFSymbol } from 'sf-symbols-typescript';

import NativeRaceScreen from './native-race';
import SvgVariablesScreen from './svg-variables';
import VariableFontsScreen from './variable-fonts';

/**
 * the label the sdk 58 changelog gives a feature. `New` is for features the changelog adds
 * without a label. a demo never shows a stronger label than the changelog.
 */
export type Status = 'Stable' | 'New' | 'Beta' | 'Alpha' | 'Experimental';

export type ChangelogSection = { id: string; title: string };

// the beta post until the final sdk 58 post is published. the section ids are its heading ids.
const CHANGELOG_URL = 'https://expo.dev/changelog/sdk-58-beta';

export const Changelog = {
  ios27: { id: 'sdk-58-is-built-for-ios-27', title: 'SDK 58 is built for iOS 27' },
  appIntents: {
    id: 'app-intents-expose-your-app-to-siri-and-apple-intelligence',
    title: 'App Intents',
  },
  expoUi: {
    id: 'expo-ui-native-navigation-on-ios-new-compose-components-and-more',
    title: 'Expo UI: native navigation on iOS',
  },
  modules2: { id: 'expo-modules-20-beta', title: 'Expo Modules 2.0 beta' },
  router: {
    id: 'expo-router-stable-data-loaders-and-native-tabs-improved-core',
    title: 'Expo Router: stable native tabs',
  },
  other: { id: 'other-notable-changes', title: 'Other notable changes' },
} satisfies Record<string, ChangelogSection>;

export function changelogUrl(section: ChangelogSection) {
  return `${CHANGELOG_URL}#${section.id}`;
}

export type Demo = {
  slug: string;
  title: string;
  description: string;
  systemImage: SFSymbol;
  status: Status;
  changelog: ChangelogSection;
  /** a demo with its own tab. the more list opens the tab. */
  href?: Href;
  /** a demo in the more tab, opened at `/more/<slug>`. */
  screen?: ComponentType;
};

// one line per demo. a demo with neither `href` nor `screen` is the app itself, and its row opens
// the changelog.
export const DEMOS: Demo[] = [
  {
    slug: 'mail',
    title: 'Mail',
    description: 'A three-column split view that stacks when you fold the Duo',
    systemImage: 'envelope',
    status: 'New',
    changelog: Changelog.expoUi,
    href: '/',
  },
  {
    slug: 'app-intents',
    title: 'App Intents',
    description: 'Siri or Shortcuts creates a draft, and it opens in Mail',
    systemImage: 'apple.intelligence',
    status: 'Alpha',
    changelog: Changelog.appIntents,
    href: '/',
  },
  {
    slug: 'hinge',
    title: 'Hinge',
    description: 'The live hinge angle, and panels that split as you open the Duo',
    systemImage: 'rectangle.split.2x1',
    status: 'New',
    changelog: Changelog.ios27,
    href: '/duo',
  },
  {
    slug: 'variable-fonts',
    title: 'Variable fonts',
    description: 'One font file, nine weights and their italics, with expo-font',
    systemImage: 'textformat.size',
    status: 'New',
    changelog: Changelog.other,
    screen: VariableFontsScreen,
  },
  {
    slug: 'svg-variables',
    title: 'SVG variables',
    description: 'One SVG, recolored live with expo-image svgVariables',
    systemImage: 'paintbrush',
    status: 'New',
    changelog: Changelog.other,
    screen: SvgVariablesScreen,
  },
  {
    slug: 'native-race',
    title: 'Native race',
    description: 'One Swift function in the module DSL and with @JS, called 100,000 times',
    systemImage: 'flag.checkered',
    status: 'Beta',
    changelog: Changelog.modules2,
    screen: NativeRaceScreen,
  },
  {
    slug: 'native-tabs',
    title: 'Tabs and toolbars',
    description: 'The native tab bar and toolbar buttons in this app',
    systemImage: 'menubar.dock.rectangle',
    status: 'Stable',
    changelog: Changelog.router,
  },
];

export function demo(slug: string): Demo {
  const found = DEMOS.find((d) => d.slug === slug);
  if (!found) throw new Error(`no demo with the slug "${slug}"`);
  return found;
}
