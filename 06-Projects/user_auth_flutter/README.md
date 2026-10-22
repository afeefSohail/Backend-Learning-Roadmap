# UserAuth: Flutter (iOS + Android)

The same app as the Skip version (login, register, profile, photos) written once in Dart with Flutter.

## Tech stack

- Flutter + Material 3, Dart 3.6+
- **Riverpod 3** for state (`Notifier`, `AsyncNotifier`)
- **Dio 5** for HTTP, with a queued interceptor that refreshes the access token once on 401
- **flutter_secure_storage** for tokens (Keychain on iOS, Keystore-backed on Android)
- **image_picker** for photos (multi-select works on both platforms)

## Project structure

```
user_auth_flutter/
  pubspec.yaml
  lib/
    main.dart                 ProviderScope + runApp
    app.dart                  root: picks Splash / Login / Home from auth state
    home_shell.dart           bottom tabs (Photos, Profile)
    core/
      config.dart             API base URL (10.0.2.2 on Android emulator)
      networking/             api_client.dart, api_error.dart, endpoints.dart
      storage/token_store.dart
    models/                   api_response, auth_data, user, photo
    features/
      auth/                   auth_controller (AppState), auth_repository, login, register, validators
      profile/                profile_controller, profile_screen (+ edit, change password)
      photos/                 photos_controller, my_photos_screen, photo_upload_screen, photo_grid_cell
    shared/widgets.dart       LoadingButton, ErrorBanner, EmptyState, PasswordField
  test/models_test.dart
```

## Setup (one time)

```bash
flutter doctor
```
Checks Flutter, Xcode, Android Studio, the Android SDK and licences. Fix anything marked ✗.

## Create the project

This folder has `lib/`, `test/` and `pubspec.yaml` but no `android/` or `ios/` folders. Generate them:

```bash
cd ~/Projects
flutter create --org com.afeef --project-name user_auth --platforms ios,android user_auth_flutter
```

Run it **on this folder**. `flutter create` only adds missing files and keeps the existing `lib/` and `pubspec.yaml`. Delete the generated `test/widget_test.dart` (it refers to the template's `MyApp`). Then:

```bash
cd user_auth_flutter
rm -f test/widget_test.dart
flutter pub get
flutter test
```

## Platform changes (do these once)

### Android: `android/app/src/main/AndroidManifest.xml`

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET"/>
    <!-- usesCleartextTraffic is for development only: it allows http://10.0.2.2 -->
    <application
        android:usesCleartextTraffic="true"
        ...>
```

`INTERNET` is only added automatically to debug builds, so add it for release too. Remove `usesCleartextTraffic` and use HTTPS for release.

### Android: `android/app/build.gradle.kts`

```kotlin
defaultConfig {
    minSdk = 24   // image_picker needs 24, flutter_secure_storage needs 23
}
```

### iOS: `ios/Runner/Info.plist`

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Choose photos to upload to your account.</string>
<key>NSCameraUsageDescription</key>
<string>Take a photo to upload to your account.</string>
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsLocalNetworking</key><true/>   <!-- dev only: http://localhost -->
</dict>
```

## Running

```bash
flutter devices                 # list simulators, emulators and phones
flutter emulators --launch Pixel_9_Pro
flutter run                     # pick a device, or: flutter run -d emulator-5554
```

Press `r` for hot reload and `R` for hot restart. No Gradle log digging needed: Dart errors show directly in the terminal and IDE.

Point at a different server without editing code:

```bash
flutter run --dart-define=API_BASE_URL=https://api.example.com
```

On a **physical Android phone**, `10.0.2.2` won't work. Use your Mac's LAN IP (`ipconfig getifaddr en0`) via `--dart-define`.

## Backend contract (01-UserAuthBackend)

Matched to the Express + Prisma backend in `Backend-Learning-Roadmap/06-Projects/01-UserAuthBackend`. Paths live in `lib/core/networking/endpoints.dart`.

Start the backend first: `docker compose up` in that folder. The API listens on port 3000.

| Method | Path | Auth | Body | `data` in response |
|---|---|---|---|---|
| POST | `/auth/register` | | `email, password, name?` | user (no tokens, so the app logs in right after) |
| POST | `/auth/login` | | `email, password` | `{ user, accessToken, refreshToken }` |
| POST | `/auth/refresh` | | `refreshToken` | access token as a **bare string**; refresh token is not rotated |
| POST | `/auth/logout` | | `refreshToken` | null |
| GET | `/auth/me` | Bearer | | user with `photos` |
| PATCH | `/user/me` | Bearer | `name` | user with `photos` |
| DELETE | `/user/me` | Bearer | | null (cascades photos and tokens) |
| GET | `/user/me/photos` | Bearer | | `[photo]`, newest first |
| POST | `/user/me/photos` | Bearer | multipart, field **`photos`** repeated, max 10 | `[photo]` (201) |
| GET | `/user/photos/:photoId` | Bearer | | photo |
| DELETE | `/user/photos/:photoId` | Bearer | | null |
| GET | `/user/:id` | | | public user (not used by the app) |

Every `sendResponse` reply is `{ meta: { code, message }, data }`. The auth middleware's 401 is a bare `{ message }`. Zod failures are 400 with `data: [{ field: "body.email", message }]`, shown under the matching field.

### Rules the app enforces before sending

| Rule | Where it comes from |
|---|---|
| Password: 8+ chars, one uppercase, one number | `signUpSchema` |
| Name optional, 5+ chars if given | `signUpSchema` (`min(5)` + `optional()`) |
| Email lowercased and trimmed before login and register | `loginSchema` uses `.lowercase()` |
| JPEG, PNG or WEBP only; 5 MB per file; 10 files per request | `upload.middleware.ts` |
| Each file part sent with its real `Content-Type` (`image/jpeg` etc.) | multer `fileFilter` checks `file.mimetype` |
| Photo URLs `/uploads/...` made absolute with the app's base URL | photos are served by `express.static` |

## Backend issues found (nothing was changed in the backend)

The app works around all of these. They are worth fixing in the backend when you next work on it.

1. **Login rejects uppercase emails.** `loginSchema` uses `z.string().trim().lowercase()`. In Zod, `.lowercase()` is a *check*, not a transform, so `Afeef@x.com` fails validation. `signUpSchema` correctly uses `.toLowerCase()`. Use `.toLowerCase()` in `loginSchema` too.
2. **Passwords with outer spaces can never log in.** `signUpSchema` trims the password before hashing; `loginSchema` does not trim. Remove `.trim()` from the sign-up password (or add it to login).
3. **Full photo URLs are computed but not sent.** In `photo.controllers.ts` and `user.controllers.ts`, `photosWithFullUrl` / `userWithFullPhotoUrls` are built and then `data: photos` / `data: user` is sent instead. Also, `url.util.ts` hardcodes `http://localhost:3000`, which an Android emulator or phone can't reach. Returning the relative path (current behaviour) is actually the better choice for mobile; consider deleting the unused helpers.
4. **Multer errors return HTML, not JSON.** A wrong file type or a file over 5 MB triggers Express's default error page with status 500. Add an error-handling middleware after the routes that turns `MulterError` and the `fileFilter` error into `sendResponse({ code: 400, ... })`.
5. **Register returns 200 and no tokens.** Swagger says 201. Either return 201, or return tokens like login so the client saves one round trip.
6. **`/user/:id` is declared before `/user/me`** in `user.routes.ts`. It works only because `/:id` is GET and `/me` is PATCH/DELETE. If you ever add `GET /user/me`, it will be captured by `/:id` and fail with "Invalid User ID". Move `/me` above `/:id`.
7. **`/auth/refresh` does not rotate the refresh token**, and **expired refresh tokens are only deleted when used**. Fine for learning; for production, rotate on every refresh and clean up expired rows on a schedule.
8. **Name length is not validated on `PATCH /user/me`**, so a 1-character or empty name is accepted there but would be rejected at sign-up.

## Authentication flow

1. On launch, `AuthController.restoreSession()` checks stored tokens and calls `/auth/me`.
2. State is `AuthChecking`, `Authenticated(user)` or `Unauthenticated(message)`; `app.dart` shows Splash, Home or Login.
3. Tokens are stored with `flutter_secure_storage` and cached in memory.
4. On a 401, the Dio interceptor refreshes once and retries. Requests are **queued**, so ten simultaneous 401s cause one refresh, not ten. If the refresh fails, tokens are cleared, `ApiClient.sessionExpired` fires, and the login screen shows "Your session has expired".

## Skip → Flutter mapping

| Skip / SwiftUI | Flutter |
|---|---|
| `@Observable` class | `Notifier` / `AsyncNotifier` |
| `@State` on a view | `StatefulWidget` + `setState` |
| `@Environment(AppState.self)` | `ref.watch(authControllerProvider)` |
| `@Bindable` + `$binding` | `TextEditingController` |
| `AppState.authState` enum | `sealed class AuthState` + `switch` |
| SkipKeychain | `flutter_secure_storage` |
| PhotosUI / SkipKit `withMediaPicker` | `image_picker` (`pickMultiImage`) |
| `URLSession` + `FoundationNetworking` | `dio` |
| `ContentUnavailableView` | `EmptyState` widget |
| `#if os(Android)` | `Platform.isAndroid` at runtime |
| `SKIP_ACTION = launch` | `flutter run` |

## What got easier compared with Skip

- **No compatibility table.** Every error in the Skip checklist (PhotosUI, Security, `#Preview`, FoundationNetworking, bridging `private` state, composed types) has no Flutter equivalent.
- **Multi-photo selection works on Android**, up to 10 at a time.
- **Hot reload** instead of a full Swift-for-Android build per change.
- **Much lighter on 8 GB RAM**: no Swift Android toolchain running next to the emulator.

## Notes

- All selected photos upload in **one** request, matching `upload.array("photos", 10)`.
- Profile lets you change your **name** and **delete your account**. Email and password can't be changed because the backend has no endpoints for them.
- Long-press a photo to delete it, or tap to open it full screen (pinch to zoom).
- Riverpod's automatic retry is turned off in `main.dart`; screens show a "Try again" button instead.
