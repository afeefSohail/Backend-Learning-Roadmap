import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ProviderScope(
      // Riverpod 3 retries failed providers automatically. This app shows an
      // explicit "Try again" button instead, so turn automatic retry off.
      retry: (retryCount, error) => null,
      child: const UserAuthApp(),
    ),
  );
}
