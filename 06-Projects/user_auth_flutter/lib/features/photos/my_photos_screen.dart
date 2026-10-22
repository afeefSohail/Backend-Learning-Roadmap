import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/networking/api_error.dart';
import '../../models/photo.dart';
import '../../shared/widgets.dart';
import 'photo_grid_cell.dart';
import 'photo_upload_screen.dart';
import 'photos_controller.dart';

class MyPhotosScreen extends ConsumerWidget {
  const MyPhotosScreen({super.key});

  void _openUpload(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(fullscreenDialog: true, builder: (_) => const PhotoUploadScreen()),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref, Photo photo) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete photo?'),
        content: const Text('This cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await ref.read(photosControllerProvider.notifier).delete(photo);
      if (context.mounted) showSnack(context, 'Photo deleted');
    } catch (e) {
      if (context.mounted) showSnack(context, ApiError.from(e).message);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final photos = ref.watch(photosControllerProvider);
    final controller = ref.read(photosControllerProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('My photos')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openUpload(context),
        icon: const Icon(Icons.add_photo_alternate_outlined),
        label: const Text('Upload'),
      ),
      body: photos.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => EmptyState(
          icon: Icons.cloud_off_outlined,
          title: 'Could not load photos',
          message: ApiError.from(e).message,
          action: FilledButton.tonal(onPressed: controller.refresh, child: const Text('Try again')),
        ),
        data: (list) => RefreshIndicator(
          onRefresh: controller.refresh,
          child: list.isEmpty
              // ListView so pull-to-refresh still works when empty.
              ? ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(
                      height: MediaQuery.sizeOf(context).height * 0.6,
                      child: EmptyState(
                        icon: Icons.photo_library_outlined,
                        title: 'No photos yet',
                        message: 'Tap Upload to add your first photo.',
                        action: FilledButton(
                          onPressed: () => _openUpload(context),
                          child: const Text('Upload photos'),
                        ),
                      ),
                    ),
                  ],
                )
              : GridView.builder(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(4, 4, 4, 96),
                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                    maxCrossAxisExtent: 160,
                    mainAxisSpacing: 4,
                    crossAxisSpacing: 4,
                  ),
                  itemCount: list.length,
                  itemBuilder: (context, i) {
                    final photo = list[i];
                    return PhotoGridCell(
                      photo: photo,
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => PhotoDetailScreen(photo: photo)),
                      ),
                      onLongPress: () => _confirmDelete(context, ref, photo),
                    );
                  },
                ),
        ),
      ),
    );
  }
}

class PhotoDetailScreen extends ConsumerWidget {
  const PhotoDetailScreen({super.key, required this.photo});
  final Photo photo;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: photo.createdAt != null
            ? Text(MaterialLocalizations.of(context).formatMediumDate(photo.createdAt!.toLocal()))
            : null,
        actions: [
          IconButton(
            tooltip: 'Delete',
            icon: const Icon(Icons.delete_outline),
            onPressed: () async {
              try {
                await ref.read(photosControllerProvider.notifier).delete(photo);
                if (context.mounted) Navigator.of(context).pop();
              } catch (e) {
                if (context.mounted) showSnack(context, ApiError.from(e).message);
              }
            },
          ),
        ],
      ),
      body: Center(
        child: InteractiveViewer(
          maxScale: 5,
          child: Hero(
            tag: 'photo-${photo.id}',
            child: Image.network(photo.url, fit: BoxFit.contain),
          ),
        ),
      ),
    );
  }
}
