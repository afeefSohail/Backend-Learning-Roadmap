# UserAuth: Skip (Swift + Android) App

A SwiftUI authentication app (login, register, profile, photos) built with **Skip Fuse** so the same Swift code runs on iOS and Android.

## Tech stack

- SwiftUI with iOS 17+ state management (`@Observable`, `@State`, `@Bindable`, `@Environment`)
- Skip Fuse (native): Swift compiled for Android with the Swift SDK for Android
- SkipKeychain: secure token storage on both platforms
- SkipKit: media picker on Android (`PhotosUI` is iOS only)
- Backend: REST API with access and refresh tokens

## Project structure

```
user-auth-app/
  Skip.env                    shared settings (app name, bundle id, version)
  Darwin/                     iOS app target and UserAuth.xcconfig
  Android/                    Android app project (Gradle)
  Sources/UserAuth/           the Swift module (all app code lives here)
    AppState.swift            global auth state (@Observable)
    ContentView.swift         root view used by the app entry point
    Features/
      Auth/                   LoginView, RegisterView, AuthViewModel
      Profile/                ProfileView, ProfileViewModel
      Photos/                 MyPhotosView, PhotoUploadView, PhotoGridCell, PhotosViewModel
    Models/                   APIResponse, AuthData, User, Photo
    Networking/               APIClient, Endpoint, APIError, TokenStore, Config
```

## Setup (one time per Mac)

```bash
brew install skiptools/skip/skip
```
Installs Skip and its build tools.

```bash
skip checkup
```
Verifies Android Studio, the SDK, the emulator, Gradle and the Swift toolchain.

```bash
skip android sdk install
```
Downloads the Swift SDK for Android. A native (Fuse) app cannot build without it.

```bash
skip android sdk list
```
Optional: shows which Android SDKs are installed.

## Creating a project

Use a folder path **without spaces** (Gradle can fail on spaces).

```bash
mkdir -p ~/Projects && cd ~/Projects
skip init --open-xcode --native-app --appid=com.afeef.userauth user-auth-app UserAuth
```

- `--native-app` creates a Skip Fuse app (use `--transpiled-app` for Skip Lite)
- `--appid` is the bundle id for iOS and Android
- `user-auth-app` is the folder name, `UserAuth` is the app and module name

Then copy the Swift files into `Sources/UserAuth/`.

## Running on Android

Start an emulator first:

```bash
adb devices
```
Lists connected devices. You want `emulator-5554   device`.

```bash
~/Library/Android/sdk/emulator/emulator -list-avds
~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro
```
Lists your emulator images, then starts one. Do not start it twice. You can also use Android Studio's Device Manager.

If Skip reports "No connected devices" but the emulator is running:

```bash
adb kill-server
adb start-server
adb devices
```

Build and run:

- From Xcode: choose the app scheme and run. `SKIP_ACTION = launch` in the xcconfig also launches Android.
- From the terminal (project root must contain `Skip.env` and `Android/`):

```bash
skip app launch --android
```

## Debugging build errors

Xcode overwrites the Gradle log on every build. The error lines are buried in very long output, so filter them:

```bash
LOG="<path to skip-gradle.log.txt shown in the Xcode build error>"
grep -n -A6 "error:" "$LOG" | grep -v "failed with a nonzero" | cut -c1-300 | head -60
```

Fix the first error shown, rebuild, and repeat. Each build reveals the next error.

## Android compatibility checklist

Things that failed on Android in this project and their fixes:

| Error | Cause | Fix |
|---|---|---|
| `no such module 'PhotosUI'` | Apple only | Guard with `#if os(Android)` and use SkipKit's `withMediaPicker` |
| `no such module 'Security'` | Keychain is Apple only | Use SkipKeychain (`Keychain.shared`) |
| `no macro named 'Preview'` | `#Preview` is Apple only | Wrap in `#if !os(Android)` |
| `cannot find 'URLRequest'` or `URLSession.shared` | Lives in `FoundationNetworking` on Android | `#if canImport(FoundationNetworking) import FoundationNetworking #endif` |
| `cannot find 'ContentUnavailableView'` | Not in SkipUI yet | Use a `VStack` with an image and text |
| `Call can throw, but is not marked with 'try'` | Keychain `set` and `removeValue` throw | Use `try?`, or `try` inside `do/catch` |
| `Private state property ... cannot be bridged` | Skip needs visible state | Remove `private` on `@State` and `@Environment` properties |
| `Kotlin does not support composed types` | `Codable & Sendable` in public API | Use a single protocol such as `RequestBody` |

## Configuration

API base URL lives in Swift (not in xcconfig or `Skip.env`, which cannot hold code and are not readable on Android):

```swift
enum Config {
    #if os(Android)
    static let apiBaseURL = "http://10.0.2.2:3000"   // emulator's address for the host Mac
    #else
    static let apiBaseURL = "http://localhost:3000"
    #endif
}
```

For local development on Android, plain `http://` needs `android:usesCleartextTraffic="true"` on the `<application>` tag of `AndroidManifest.xml`. Use HTTPS for release.

## Authentication flow

1. On launch, `AppState.restoreSession()` checks stored tokens and calls `/auth/me`.
2. `AppState.authState` is `.checking`, `.authenticated` or `.unauthenticated`, and `SplashView` shows the matching screen.
3. Tokens are stored with SkipKeychain.
4. When a request returns 401, `APIClient` refreshes the access token once and retries. If the refresh fails, the tokens are cleared and the user is signed out.

## State management (iOS 17+)

| Old | New |
|---|---|
| `ObservableObject` and `@Published` | `@Observable` |
| `@StateObject` | `@State` |
| `@ObservedObject` | plain property, or `@Bindable` for `$` bindings |
| `@EnvironmentObject` | `@Environment(Type.self)` |

Add `import SkipFuse` to `@Observable` classes if Skip warns about it.

## Notes

- Multi-photo selection works on iOS only. The Android picker returns one image at a time.
- Keep the `public` API surface small so Skip has less to bridge.
- 8 GB of RAM is tight for the emulator plus the Swift Android build. Close other apps, or use an older emulator image (API 34 or 35).
