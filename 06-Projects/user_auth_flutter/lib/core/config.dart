import 'dart:io' show Platform;

/// API settings. Same idea as `Config.swift`, but a single runtime check
/// replaces the `#if os(Android)` compile-time branch.
///
/// Override at build time without touching code:
///   flutter run --dart-define=API_BASE_URL=https://api.example.com
class Config {
  Config._();

  static const _override = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_override.isNotEmpty) return _override;
    // 10.0.2.2 is the Android emulator's address for the host machine.
    // A physical device needs your machine's LAN IP instead.
    return Platform.isAndroid ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }

  static const connectTimeout = Duration(seconds: 15);
  static const receiveTimeout = Duration(seconds: 30);
}
