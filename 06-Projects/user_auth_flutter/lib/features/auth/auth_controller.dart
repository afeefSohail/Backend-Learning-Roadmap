import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/networking/api_client.dart';
import '../../core/networking/api_error.dart';
import '../../models/user.dart';
import 'auth_repository.dart';

/// Mirrors `AppState.authState`: checking, authenticated or unauthenticated.
sealed class AuthState {
  const AuthState();
}

class AuthChecking extends AuthState {
  const AuthChecking();
}

class Authenticated extends AuthState {
  const Authenticated(this.user);
  final User user;
}

class Unauthenticated extends AuthState {
  const Unauthenticated({this.message});

  /// Shown on the login screen, e.g. "Your session has expired".
  final String? message;
}

/// Global auth state. The Flutter equivalent of the `@Observable AppState`
/// injected with `@Environment`.
class AuthController extends Notifier<AuthState> {
  StreamSubscription<void>? _expirySub;

  AuthRepository get _repo => ref.read(authRepositoryProvider);

  @override
  AuthState build() {
    _expirySub = ref.watch(apiClientProvider).sessionExpired.listen((_) {
      if (state is Authenticated) {
        state = const Unauthenticated(message: 'Your session has expired. Please sign in again.');
      }
    });
    ref.onDispose(() => _expirySub?.cancel());

    // Kick off session restore after the first frame of state exists.
    Future.microtask(restoreSession);
    return const AuthChecking();
  }

  /// Same as `AppState.restoreSession()`.
  Future<void> restoreSession() async {
    if (!await _repo.hasStoredSession) {
      state = const Unauthenticated();
      return;
    }
    try {
      state = Authenticated(await _repo.currentUser());
    } on ApiError catch (e) {
      // Offline at launch? Keep tokens; let the user retry by signing in.
      state = Unauthenticated(message: e.isUnauthorized ? null : e.message);
    }
  }

  /// Throws [ApiError] so the form can show field errors.
  Future<void> login(String email, String password) async {
    state = Authenticated(await _repo.login(email: email, password: password));
  }

  Future<void> register(String name, String email, String password) async {
    state = Authenticated(await _repo.register(name: name, email: email, password: password));
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const Unauthenticated();
  }

  /// Called by the profile screen after editing.
  void updateUser(User user) {
    if (state is Authenticated) state = Authenticated(user);
  }

  /// Called after DELETE /user/me succeeds.
  Future<void> accountDeleted() async {
    await _repo.clearLocalSession();
    state = const Unauthenticated(message: 'Your account has been deleted.');
  }
}

final authControllerProvider = NotifierProvider<AuthController, AuthState>(AuthController.new);

/// Convenience for screens that only exist while signed in.
final currentUserProvider = Provider<User?>((ref) {
  final s = ref.watch(authControllerProvider);
  return s is Authenticated ? s.user : null;
});
