import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/networking/api_error.dart';
import '../../shared/widgets.dart';
import 'photos_controller.dart';

/// Replaces `PhotoUploadView` + PhotosUI / SkipKit's `withMediaPicker`.
/// `image_picker` supports multi-select on iOS AND Android, so the
/// "Android picks one at a time" limitation is gone.
///
/// All selected photos go up in ONE request, as the backend expects.
/// The backend has no caption field, so there is none here.
class PhotoUploadScreen extends ConsumerStatefulWidget {
  const PhotoUploadScreen({super.key});

  static const maxPhotos = UploadLimits.maxFiles;

  @override
  ConsumerState<PhotoUploadScreen> createState() => _PhotoUploadScreenState();
}

class _PhotoUploadScreenState extends ConsumerState<PhotoUploadScreen> {
  final _picker = ImagePicker();
  final List<XFile> _selected = [];

  bool _uploading = false;
  double _progress = 0;

  /// Keeps only files the backend will accept and tells the user about the rest.
  Future<List<XFile>> _accept(List<XFile> files) async {
    final ok = <XFile>[];
    final problems = <String>[];
    for (final f in files) {
      final problem = await PhotosController.checkFile(f);
      problem == null ? ok.add(f) : problems.add(problem);
    }
    if (problems.isNotEmpty && mounted) {
      showSnack(context, problems.length == 1 ? problems.first : '${problems.length} photos skipped: ${problems.first}');
    }
    return ok;
  }

  Future<void> _pickFromLibrary() async {
    final remaining = PhotoUploadScreen.maxPhotos - _selected.length;
    if (remaining <= 0) return;
    try {
      // Resize on device: faster uploads, smaller server storage.
      final List<XFile> files;
      if (remaining == 1) {
        // pickMultiImage requires limit >= 2.
        final one = await _picker.pickImage(
            source: ImageSource.gallery, maxWidth: 2048, imageQuality: 85);
        files = one == null ? [] : [one];
      } else {
        files = await _picker.pickMultiImage(maxWidth: 2048, imageQuality: 85, limit: remaining);
      }
      final accepted = await _accept(files.take(remaining).toList());
      if (accepted.isEmpty || !mounted) return;
      setState(() => _selected.addAll(accepted));
    } catch (e) {
      if (mounted) showSnack(context, 'Could not open photos: $e');
    }
  }

  Future<void> _takePhoto() async {
    if (_selected.length >= PhotoUploadScreen.maxPhotos) return;
    try {
      final file = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 2048,
        imageQuality: 85,
      );
      if (file == null) return;
      final accepted = await _accept([file]);
      if (accepted.isNotEmpty && mounted) setState(() => _selected.addAll(accepted));
    } catch (e) {
      if (mounted) showSnack(context, 'Camera unavailable: $e');
    }
  }

  Future<void> _upload() async {
    if (_selected.isEmpty) return;
    setState(() {
      _uploading = true;
      _progress = 0;
    });
    final total = _selected.length;
    try {
      await ref.read(photosControllerProvider.notifier).upload(
            List.of(_selected),
            onProgress: (p) {
              if (mounted) setState(() => _progress = p);
            },
          );
      if (!mounted) return;
      showSnack(context, total == 1 ? 'Photo uploaded' : '$total photos uploaded');
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _uploading = false);
      showSnack(context, ApiError.from(e).message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final count = _selected.length;
    final full = count >= PhotoUploadScreen.maxPhotos;

    return PopScope(
      canPop: !_uploading,
      child: Scaffold(
        appBar: AppBar(
          title: Text(count == 0 ? 'Upload photos' : '$count selected'),
          actions: [
            TextButton(
              onPressed: count == 0 || _uploading ? null : _upload,
              child: const Text('Upload'),
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _uploading || full ? null : _pickFromLibrary,
                    icon: const Icon(Icons.photo_library_outlined),
                    label: const Text('Library'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _uploading || full ? null : _takePhoto,
                    icon: const Icon(Icons.photo_camera_outlined),
                    label: const Text('Camera'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Up to ${PhotoUploadScreen.maxPhotos} photos at a time. JPEG, PNG or WEBP, 5 MB each.',
              style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.outline),
            ),
            const SizedBox(height: 16),
            if (count == 0)
              const SizedBox(
                height: 240,
                child: EmptyState(
                  icon: Icons.add_photo_alternate_outlined,
                  title: 'No photos selected',
                  message: 'Choose from your library or take a new one.',
                ),
              )
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 6,
                  crossAxisSpacing: 6,
                ),
                itemCount: count,
                itemBuilder: (context, i) => _Thumb(
                  file: _selected[i],
                  dimmed: _uploading,
                  onRemove: _uploading ? null : () => setState(() => _selected.removeAt(i)),
                ),
              ),
            if (_uploading) ...[
              const SizedBox(height: 8),
              LinearProgressIndicator(value: _progress),
              const SizedBox(height: 8),
              Text(
                'Uploading $count ${count == 1 ? 'photo' : 'photos'}  ·  ${(_progress * 100).round()}%',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 16),
            LoadingButton(
              label: count <= 1 ? 'Upload photo' : 'Upload $count photos',
              loading: _uploading,
              onPressed: count == 0 ? null : _upload,
            ),
          ],
        ),
      ),
    );
  }
}

class _Thumb extends StatelessWidget {
  const _Thumb({required this.file, required this.dimmed, this.onRemove});

  final XFile file;
  final bool dimmed;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: AnimatedOpacity(
            opacity: dimmed ? 0.4 : 1,
            duration: const Duration(milliseconds: 200),
            child: Image.file(File(file.path), fit: BoxFit.cover, cacheWidth: 300),
          ),
        ),
        if (onRemove != null)
          Positioned(
            top: 4,
            right: 4,
            child: Material(
              color: Colors.black54,
              shape: const CircleBorder(),
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: onRemove,
                child: const Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(Icons.close, size: 16, color: Colors.white),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
