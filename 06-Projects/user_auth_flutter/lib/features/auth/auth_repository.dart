import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/networking/api_client.dart';
import '../../core/networking/endpoints.dart';
import '../../core/storage/token_store.dart';
import '../../models/auth_data.dart';
import '../../models/user.dart';

/// Talks to auth.controllers.ts and keeps tokens in sync.
class AuthRepository {
  AuthRepository(this._api, this._tokens);

  final ApiClient _api;
  final TokenStore _tokens;

  /// loginSchema uses `.lowercase()`, which REJECTS uppercase instead of
  /// converting it, so the email must be lowercased before sending.
  static String _normaliseEmail(String email) => email.trim().toLowerCase();

  /// POST /auth/login -> data: { user, accessToken, refreshToken }
  Future<User> login({required String email, required String password}) async {
    final res = await _api.post(Endpoints.login, body: {
      'email': _normaliseEmail(email),
      'password': password,
    });
    final auth = AuthData.fromJson(res.map);
    await _tokens.save(access: auth.accessToken, refresh: auth.refreshToken);
    return auth.user ?? await currentUser();
  }

  /// POST /auth/register -> data: user (no tokens), so log in right after.
  Future<User> register({
    required String email,
    required String password,
    String? name,
  }) async {
    final trimmedName = name?.trim() ?? '';
    await _api.post(Endpoints.register, body: {
      'email': _normaliseEmail(email),
      'password': password,
      // name is optional but must be >= 5 chars if present, so omit when empty.
      if (trimmedName.isNotEmpty) 'name': trimmedName,
    });
    return login(email: email, password: password);
  }

  /// GET /auth/me -> data: user (with photos).
  Future<User> currentUser() async {
    final res = await _api.get(Endpoints.me);
    return User.fromJson(res.map);
  }

  Future<bool> get hasStoredSession => _tokens.hasTokens;

  /// POST /auth/logout { refreshToken } deletes the token row server side.
  Future<void> logout() async {
    final refresh = await _tokens.refreshToken;
    try {
      if (refresh != null) {
        await _api.post(Endpoints.logout, body: {'refreshToken': refresh});
      }
    } catch (_) {
      // Signing out locally must always work, even offline.
    } finally {
      await _tokens.clear();
    }
  }

  /// After DELETE /user/me: the refresh token rows are gone via cascade,
  /// so only local tokens need clearing.
  Future<void> clearLocalSession() => _tokens.clear();
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider), ref.watch(tokenStoreProvider));
});
