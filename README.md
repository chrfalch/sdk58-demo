# Expo SDK 58 demo app

The example app for the "What's new in Expo SDK 58" video. It starts from the SDK 58 default template (`create-expo-app --template default@sdk-58`). SDK 58 features are added one at a time on top of it.

## Run it

This app uses a development build, not Expo Go. Native code runs on iOS (Xcode 27) and Android.

```bash
bun install
bun run ios       # or: bun run android
bun run web
```

After the first native build, `bun start` starts Metro for the installed app.

## Checks

```bash
bun run check              # typecheck and lint, zero warnings
bunx expo install --check  # SDK-compatible dependency versions
bunx expo-doctor@latest
bun run export             # production bundles for iOS, Android, and web
```

## Changes to the template

- `src/types/expo.d.ts` references `expo/types`, so CSS imports type-check before Metro generates `expo-env.d.ts`.
- `src/components/app-tabs.web.tsx` gives `TabButton` the `Pressable` ref type. React Native 0.88 types this ref as a native element, and the template's slot props do not match it.
- `src/hooks/use-color-scheme.web.ts` uses `useSyncExternalStore` for the hydration check. The template set state in an effect.
- ESLint is on version 9. `expo install eslint` picks ESLint 10, and `eslint-plugin-react` crashes on it (`contextOrFilename.getFilename is not a function`).
- `expo-dev-client` is installed, and `bun run ios` / `bun run android` make development builds.

## Known issue: precompiled modules are off on iOS

`app.json` sets `expo-build-properties` `ios.usePrecompiledModules` to `false`. Every Expo module builds from source.

With precompiled modules on (the SDK 58 default), the app built with Xcode 27 stops at launch:

```
Symbol not found: _swift_allocateMetadataPack
Referenced from: ExpoModulesCore.framework/ExpoModulesCore
Expected in:     ExpoModulesJSI.framework/ExpoModulesJSI
```

The precompiled `expo-modules-core` 58.0.16 was built with the iOS 26.4 SDK. It binds the Swift parameter pack runtime symbols to `ExpoModulesJSI`. `expo-modules-jsi` 58.0.11 builds from source on this machine (Xcode 27), and that build does not export them. Both versions were published on October 13, 2026. The `expo-modules-jsi` 58.0.11 changelog adds parameter pack APIs.

Remove the `expo-build-properties` entry when a fixed `expo-modules-core` or `expo-modules-jsi` is published, then run `bunx expo prebuild --platform ios --clean` and launch the app again.
