import '../core/config.dart';
import 'json_utils.dart';

/// Matches Prisma `Photo`: id, url, userId, createdAt, updatedAt.
///
/// The backend stores and returns a relative url ("/uploads/<file>.jpg")
/// served by `express.static`. It is made absolute here with the app's own
/// base URL, so it works on the Android emulator (10.0.2.2) too.
class Photo {
  const Photo({
    required this.id,
    required this.url,
    this.userId,
    this.createdAt,
  });

  final String id;
  final String url;
  final String? userId;
  final DateTime? createdAt;

  factory Photo.fromJson(Map<String, dynamic> json) => Photo(
        id: pickId(json),
        url: _absolute(pick<String>(json, 'url') ?? ''),
        userId: json['userId']?.toString(),
        createdAt: pickDate(json, 'createdAt', 'created_at'),
      );

  static String _absolute(String path) {
    final base = Config.apiBaseUrl.replaceAll(RegExp(r'/+$'), '');
    // If the backend ever returns http://localhost:3000/uploads/... (url.util.ts),
    // swap the host so the device can reach it.
    final local = RegExp(r'^https?://(localhost|127\.0\.0\.1)(:\d+)?');
    if (local.hasMatch(path)) return path.replaceFirst(local, base);
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return path.startsWith('/') ? '$base$path' : '$base/$path';
  }
}
