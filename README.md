# Expo SDK 58 demo

An app that shows what is new in Expo SDK 58, on iOS and Android. It is built for foldables: the iPhone Duo and Android foldables such as the Pixel Fold. It is the demo app of the "What's new in Expo SDK 58" video.

Each demo shows its label from the [SDK 58 changelog](https://expo.dev/changelog/sdk-58-beta) (Stable, New, Beta, Alpha, or Experimental) and links to its section. Tap the info button on a demo screen to see them.

## What is in it

| Tab      | Demo              | SDK 58 feature                                        | Label  | Platforms    |
| -------- | ----------------- | ----------------------------------------------------- | ------ | ------------ |
| Mail     | Mail              | Expo UI `NavigationSplitView` on iOS                  | New    | iOS, Android |
| Mail     | App Intents       | `expo-app-intents`: Siri and Shortcuts create a draft | Alpha  | iOS          |
| Home     | Inbox widget      | `expo-widgets` home screen widgets on Android         | New    | Android, iOS |
| Duo/Fold | Hinge             | `expo-hinge`, and `ArrangementView` on iOS            | New    | iOS, Android |
| More     | Variable fonts    | `expo-font` variable fonts                            | New    | iOS, Android |
| More     | SVG variables     | `expo-image` `svgVariables`                           | New    | iOS, Android |
| More     | Native race       | Expo Modules 2.0: `@JS` against the module DSL        | Beta   | iOS, Android |
| All      | Tabs and toolbars | Expo Router native tabs and `Stack.Toolbar`           | Stable | iOS, Android |

On Android, the tabs are Mail, Fold, and More, and the screens use Jetpack Compose through Expo UI.

### Mail

A three-column mail client built with Expo UI's `NavigationSplitView`: mailboxes, messages, and the open message. On the unfolded Duo (or an iPad), the columns are side by side. On the folded Duo (or an iPhone), they become a stack. Fold or unfold the Duo, and the open message stays open. Swipe a message to archive, flag, or delete it, and tap Reply to start a draft.

`NavigationSplitView` is SwiftUI only. On Android, the Mail tab is a Material 3 inbox with Expo UI's Jetpack Compose components and the same mail data. On an unfolded foldable, the open message sits beside the list.

### App Intents

Siri, Spotlight, Shortcuts, or Apple Intelligence can start a draft, and it opens in Drafts in the Mail tab. The intents are Swift files in `app-intents/`, which `npx expo-app-intents init --examples mail` created:

- `CreateDraftIntent` adopts Apple's `.mail.createDraft` schema, so Apple Intelligence and Siri find it without a phrase.
- `NewDraftIntent` is a plain intent with the phrase "New draft in SDK 58". Siri asks for the subject. It also shows in Spotlight: search for "SDK 58" and tap "New Draft".

Both intents send a `createMailDraft` invocation to JavaScript. `src/demos/mail/use-draft-intents.ts` handles it with `useAppIntents()`, including invocations that arrive while the app is closed.

### Inbox widget

A home screen widget with the unread mail from the Mail tab, written in React with `expo-widgets`. Home screen widgets are new on Android in SDK 58. The same widget has an iOS layout too.

- `src/demos/inbox-widget/inbox-widget.android.tsx` uses Expo UI's Jetpack Compose components, which `expo-widgets` draws with Glance. Its colors come from the wallpaper's Material You palette (`getMaterialColors()`).
- `src/demos/inbox-widget/inbox-widget.tsx` is the iOS layout, with SwiftUI components.
- `app.json` declares the widget for both platforms. On Android, the config plugin needs `"enableAndroid": true`.

The app sends every inbox change to the widget with `updateSnapshot()`, so reading a message in the app updates the count. The widget's "Mark all read" button returns the widget's new props, so it works without the app on screen, and the app mirrors it with `addUserInteractionListener()`.

To add it on Android: long-press the home screen, tap Widgets, and find SDK 58. On iOS: long-press the home screen, tap Edit, then Add Widget, and find SDK 58.

### Hinge

The live hinge angle and status from `expo-hinge`, and the lowest and highest angle of the session. Open the Duo, and Expo UI's `ArrangementView` splits the screen into two panels. The picker switches the arrangement between adaptive, side by side, and stacked. On a device without a hinge, the tab says that it needs an iPhone Duo.

On Android, the Fold tab shows the same readings in Material 3, side by side when the device is unfolded. Android reports the hinge only while the app's window spans the fold, and never reports "closed".

### Variable fonts

One Roboto Flex file, loaded with `useFonts`, gives nine weights and their italics. React Native 0.88's `fontVariationSettings` sets the weight and slant axes, and a slider moves the weight from 100 to 1000 live. The slider is a universal Expo UI component: SwiftUI on iOS, Jetpack Compose on Android.

On iOS, `fontWeight: '100'` and `'200'` do not pick the Thin and ExtraLight instances of this font: React Native maps 100 to Apple's UltraLight and 200 to Apple's Thin, so 200 renders as the Thin instance. `fontVariationSettings` sets the axis value itself, so every weight is correct.

Roboto Flex is © The Roboto Flex Project Authors, under the SIL Open Font License 1.1 (`src/demos/variable-fonts/OFL.txt`).

### SVG variables

One SVG file of a house, drawn by `expo-image` on iOS and Android. The SVG reads its colors from CSS variables (`var(--roof, #888888)`), and the `svgVariables` prop fills them in, so the picker recolors the roof and the image stays a vector.

### Native race

The local module in `modules/native-race` has the same Swift function twice: once in the module definition DSL, and once as a plain method marked `@JS`, which Expo Modules 2.0 binds at build time.

```swift
// The old way: describe the function inside the definition DSL.
Function("addNumbers") { (a: Double, b: Double) in
  return a + b
}

// The new way: an ordinary Swift method, exposed to JavaScript with @JS.
@JS
private func addNumbersSynthesized(a: Double, b: Double) throws -> Double {
  return a + b
}
```

Tap "Run the race" to call each one 100,000 times. The screen shows both times, how many times faster `@JS` is, and where it measured. Run a release build for fair numbers:

```bash
bunx expo run:ios --configuration Release
```

On Android, the race has three runners, because the SDK 58 changelog also measures React Native's TurboModules on Android:

- `NativeRaceModule.kt`: the same function in the Kotlin module DSL.
- `NativeRaceV2Module.kt`: a plain Kotlin method marked `@JS`. Kotlin modules 2.0 extend a different `Module` class, so this one is its own module. `v2 true` in `android/build.gradle` turns on the Expo Modules 2.0 compiler plugin.
- `modules/native-race-turbo`: a TurboModule with a codegen spec (`src/NativeRaceTurbo.ts`). Expo autolinking finds it in `modules/` and links it like a library from npm, so the generated `android/` folder needs no changes.

```kotlin
// The new way: an ordinary Kotlin method, exposed to JavaScript with @JS.
@ExpoModule("NativeRaceV2")
class NativeRaceV2Module : Module() {
  @JS
  fun addNumbers(a: Double, b: Double): Double = a + b
}
```

```bash
bunx expo run:android --variant release
```

## Run it

This app uses a development build, not Expo Go. iOS needs Xcode 27. Android needs the Android SDK and JDK 17.

```bash
bun install
bun run ios       # or: bun run android
```

After the first native build, `bun start` starts Metro for the installed app.

### iPhone Duo

The iPhone Duo simulator and `expo-hinge` need Xcode 27.1 and the iOS 27.1 simulator runtime. If Xcode 27.0 is your default Xcode, build with Xcode 27.1 for this project only:

```bash
DEVELOPER_DIR=/Applications/Xcode-27.1.app/Contents/Developer bunx expo run:ios -d "iPhone Duo"
```

Install the runtime with `xcodebuild -downloadPlatform iOS -buildVersion 27.1`. Without `-buildVersion`, Xcode 27.1 downloads the iOS 27.0 runtime.

To fold and unfold the Duo simulator from the terminal:

```bash
bun run duo fold     # 0°: the cover screen
bun run duo half     # 90°
bun run duo unfold   # 180°: the inner screen
bun run duo 135      # any angle from 0 to 180
```

Xcode 27.1's Device Hub app has the same control.

### Android foldables

Any Android emulator runs the app. For the Fold tab, create a foldable emulator, such as a Pixel 9 Pro Fold on Android 16 (API 36), in Android Studio's Device Manager or with `avdmanager`. To fold, unfold, and set the hinge angle from the terminal:

```bash
adb emu fold
adb emu unfold
adb emu sensor set hinge-angle0 90
```

### Watch the simulator in the browser

The app includes [Expo Device Hub](https://github.com/expo/expo-device-hub), an Expo DevTools plugin. When `bun start` runs, it prints a link to a dashboard that streams the simulator, and you can tap and type in it:

```
› Expo Device Hub: http://localhost:8081/_expo/plugins/expo-device-hub
```

## How the code is organized

- `src/app/`: the routes. `index.tsx` is the Mail tab, `duo/` is the Duo tab, and `more/` is the More tab.
- `src/demos/<slug>/`: one folder per demo, with all of its code.
- `src/demos/registry.ts`: one line per demo, with its title, changelog label, and changelog section.
- `modules/`: the local native modules of the native race.
- `app-intents/`: the App Intents, in Swift.

To remove a demo, delete its folder and its line in the registry.

## Credits

Most demo code is copied from code that already runs on SDK 58, and each copied file names its source:

- [expo-ui-examples](https://github.com/SchroederNathan/expo-ui-examples) by Nathan Schroeder (MIT)
- [native-component-list](https://github.com/expo/expo/tree/main/apps/native-component-list), Expo's own test app (MIT)

## Checks

```bash
bun run check              # typecheck and lint, zero warnings
bunx expo install --check  # SDK-compatible dependency versions
bunx expo-doctor@latest
bun run export             # production bundles for iOS and Android
```

## Changes to the template

- The welcome screens, the web and Android files, and their assets are removed. The app is iOS only (`"platforms": ["ios"]`).
- `src/types/expo.d.ts` references `expo/types`, so the app type-checks before Metro generates `expo-env.d.ts`.
- ESLint is on version 9. `expo install eslint` picks ESLint 10, and `eslint-plugin-react` crashes on it (`contextOrFilename.getFilename is not a function`).
- `expo-dev-client` is installed, and `bun run ios` makes a development build.

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
