import 'package:flutter/material.dart';

import '../../models/photo.dart';

class PhotoGridCell extends StatelessWidget {
  const PhotoGridCell({super.key, required this.photo, this.onTap, this.onLongPress});

  final Photo photo;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.surfaceContainerHighest,
      clipBehavior: Clip.antiAlias,
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: onTap,
        onLongPress: onLongPress,
        child: Hero(
          tag: 'photo-${photo.id}',
          child: Image.network(
            photo.url,
            fit: BoxFit.cover,
            // Decode at grid size, not full resolution, to save memory.
            cacheWidth: 400,
            loadingBuilder: (context, child, progress) => progress == null
                ? child
                : const Center(child: CircularProgressIndicator(strokeWidth: 2)),
            errorBuilder: (context, _, __) =>
                Icon(Icons.broken_image_outlined, color: scheme.outline),
          ),
        ),
      ),
    );
  }
}
