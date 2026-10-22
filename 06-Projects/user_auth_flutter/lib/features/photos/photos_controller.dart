import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/networking/api_client.dart';
import '../../core/networking/api_error.dart';
import '../../core/networking/endpoints.dart';
import '../../models/photo.dart';
import '../auth/auth_controller.dart';

/// Limits from src/middlewares/upload.middleware.ts.
class UploadLimits {
  UploadLimits._();
  static const maxFiles = 10; //               limits.files + upload.array("photos", 10)
  static const maxBytes = 5 * 1024 * 1024; //  limits.fileSize
  static const mimeByExtension = { //          fileFilter allowedTypes
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
  };
}

/// Equivalent of `PhotosViewModel`. Matches photo.controllers.ts.
class PhotosController extends AsyncNotifier<List<Photo>> {
  ApiClient get _api => ref.read(apiClientProvider);

  @override
  Future<List<Photo>> build() {
    // Rebuild (and drop the old list) whenever a different user signs in.
    final userId = ref.watch(currentUserProvider.select((u) => u?.id));
    if (userId == null) return Future.value(const []);
    return _fetch();
  }

  /// GET /user/me/photos -> data: [photo], newest first.
  Future<List<Photo>> _fetch() async {
    final res = await ref.read(apiClientProvider).get(Endpoints.myPhotos);
    return res.list.map(Photo.fromJson).toList();
  }

  /// Pull to refresh. Old photos stay on screen until new ones arrive.
  Future<void> refresh() async {
    state = await AsyncValue.guard(_fetch);
  }

  /// Checks a file against the server's rules before uploading. Multer
  /// rejects bad files with an HTML error page, so catching it here gives
  /// the user a readable message. Returns null if the file is fine.
  static Future<String?> checkFile(XFile file) async {
    final ext = file.name.split('.').last.toLowerCase();
    if (!UploadLimits.mimeByExtension.containsKey(ext)) {
      return '${file.name}: only JPEG, PNG and WEBP images are allowed';
    }
    final size = await File(file.path).length();
    if (size > UploadLimits.maxBytes) {
      final mb = (size / (1024 * 1024)).toStringAsFixed(1);
      return '${file.name} is $mb MB. The limit is 5 MB per photo.';
    }
    return null;
  }

  /// POST /user/me/photos, multipart, every file under the field "photos",
  /// all in ONE request (upload.array("photos", 10)) -> 201 data: [photo].
  /// Throws [ApiError].
  Future<void> upload(List<XFile> files, {void Function(double progress)? onProgress}) async {
    if (files.isEmpty) return;
    if (files.length > UploadLimits.maxFiles) {
      throw const ApiError('You can upload up to ${UploadLimits.maxFiles} photos at a time.');
    }
    for (final f in files) {
      final problem = await checkFile(f);
      if (problem != null) throw ApiError(problem);
    }

    final form = FormData();
    for (final f in files) {
      final ext = f.name.split('.').last.toLowerCase();
      form.files.add(MapEntry(
        'photos',
        await MultipartFile.fromFile(
          f.path,
          filename: f.name,
          // Multer's fileFilter checks the part's Content-Type. Dio would
          // otherwise send application/octet-stream and every file would fail.
          contentType: DioMediaType.parse(UploadLimits.mimeByExtension[ext]!),
        ),
      ));
    }

    final res = await _api.upload(Endpoints.myPhotos, form: form, onProgress: onProgress);
    final added = res.list.map(Photo.fromJson).toList();

    final current = state.hasValue ? state.requireValue : const <Photo>[];
    state = AsyncData([...added.reversed, ...current]);
    // Re-sync so order and ids match the server exactly.
    await refresh();
  }

  /// DELETE /user/photos/:photoId. Optimistic: remove now, restore on failure.
  Future<void> delete(Photo photo) async {
    final before = state.hasValue ? state.requireValue : const <Photo>[];
    state = AsyncData(before.where((p) => p.id != photo.id).toList());
    try {
      await _api.delete(Endpoints.photo(photo.id));
    } catch (_) {
      state = AsyncData(before);
      rethrow;
    }
  }
}

final photosControllerProvider =
    AsyncNotifierProvider<PhotosController, List<Photo>>(PhotosController.new);
