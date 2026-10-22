import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/networking/api_client.dart';
import '../../core/networking/endpoints.dart';
import '../../models/user.dart';
import '../auth/auth_controller.dart';

/// Matches user.controllers.ts. The backend lets you change the name only
/// (email and password are not editable) and delete the account.
class ProfileController {
  ProfileController(this.ref);
  final Ref ref;

  /// PATCH /user/me { name } -> data: { id, name, email, createdAt, photos }
  Future<User> updateName(String name) async {
    final res = await ref.read(apiClientProvider).patch(Endpoints.profile, body: {
      'name': name.trim(),
    });
    final user = User.fromJson(res.map);
    ref.read(authControllerProvider.notifier).updateUser(user);
    return user;
  }

  /// DELETE /user/me. Cascades photos and refresh tokens, deletes files.
  Future<void> deleteAccount() async {
    await ref.read(apiClientProvider).delete(Endpoints.profile);
    await ref.read(authControllerProvider.notifier).accountDeleted();
  }
}

final profileControllerProvider = Provider<ProfileController>(ProfileController.new);
