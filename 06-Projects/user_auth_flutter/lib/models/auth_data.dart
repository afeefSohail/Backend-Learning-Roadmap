import 'json_utils.dart';
import 'user.dart';

/// Returned by login, register and refresh.
class AuthData {
  const AuthData({
    required this.accessToken,
    required this.refreshToken,
    this.user,
  });

  final String accessToken;
  final String refreshToken;

  /// Refresh responses usually omit the user.
  final User? user;

  factory AuthData.fromJson(Map<String, dynamic> json) {
    final userJson = json['user'];
    return AuthData(
      accessToken: pick<String>(json, 'accessToken', 'access_token') ?? '',
      refreshToken: pick<String>(json, 'refreshToken', 'refresh_token') ?? '',
      user: userJson is Map<String, dynamic> ? User.fromJson(userJson) : null,
    );
  }
}
