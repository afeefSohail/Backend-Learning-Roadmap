import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'features/auth/auth_controller.dart';
import 'features/auth/login_screen.dart';
import 'home_shell.dart';

/// Equivalent of `ContentView` + `SplashView`: picks the screen from auth state.
class UserAuthApp extends ConsumerWidget {
  const UserAuthApp({super.key});

  static final navigatorKey = GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // When auth flips (login, logout, session expired) drop any pushed
    // routes so the user never sees a stale screen on top of the new root.
    ref.listen(authControllerProvider, (prev, next) {
      if (prev.runtimeType != next.runtimeType) {
        navigatorKey.currentState?.popUntil((r) => r.isFirst);
      }
    });

    final auth = ref.watch(authControllerProvider);

    return MaterialApp(
      title: 'UserAuth',
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      theme: _theme(Brightness.light),
      darkTheme: _theme(Brightness.dark),
      home: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        child: switch (auth) {
          AuthChecking() => const SplashScreen(key: ValueKey('splash')),
          Authenticated() => const HomeShell(key: ValueKey('home')),
          Unauthenticated(:final message) =>
            LoginScreen(key: ValueKey('login-$message'), initialMessage: message),
        },
      ),
    );
  }

  ThemeData _theme(Brightness b) {
    final scheme = ColorScheme.fromSeed(seedColor: const Color(0xFF3F51B5), brightness: b);
    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: scheme.surfaceContainerHighest.withValues(alpha: 0.4),
      ),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.lock_person_rounded, size: 72, color: scheme.primary),
            const SizedBox(height: 24),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
