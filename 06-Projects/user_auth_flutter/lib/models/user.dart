import 'json_utils.dart';
import 'photo.dart';

/// Matches Prisma `User` minus passwordHash (prisma/schema.prisma).
/// `name` is optional on the backend (`String?`).
/// /auth/login and /auth/me include `photos`; /auth/register does not.
class User {
  const User({
    required this.id,
    required this.email,
    this.name,
    this.createdAt,
    this.photos = const [],
  });

  final String id;
  final String email;
  final String? name;
  final DateTime? createdAt;
  final List<Photo> photos;

  factory User.fromJson(Map<String, dynamic> json) {
    final rawPhotos = json['photos'];
    return User(
      id: pickId(json),
      email: pick<String>(json, 'email') ?? '',
      name: pick<String>(json, 'name'),
      createdAt: pickDate(json, 'createdAt', 'created_at'),
      photos: rawPhotos is List
          ? rawPhotos.whereType<Map<String, dynamic>>().map(Photo.fromJson).toList()
          : const [],
    );
  }

  bool get hasName => (name?.trim() ?? '').isNotEmpty;

  /// Name if set, otherwise the part of the email before "@".
  String get displayName => hasName ? name!.trim() : email.split('@').first;

  String get initials {
    if (!hasName) return email.isNotEmpty ? email[0].toUpperCase() : '?';
    final parts = name!.trim().split(RegExp(r'\s+'));
    return parts.take(2).map((p) => p[0].toUpperCase()).join();
  }
}
