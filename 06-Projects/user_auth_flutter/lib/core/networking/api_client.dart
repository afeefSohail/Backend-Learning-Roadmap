import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/api_response.dart';
import '../../models/auth_data.dart';
import '../config.dart';
import '../storage/token_store.dart';
import 'api_error.dart';
import 'endpoints.dart';

/// HTTP client. Same contract as `APIClient.swift`:
/// attach the access token, and on a 401 refresh once and retry.
/// If the refresh fails, clear tokens and emit on [sessionExpired].
class ApiClient {
  ApiClient({required this.tokens})
      : _dio = Dio(_options()),
        _refreshDio = Dio(_options()) {
    _dio.interceptors.add(_AuthInterceptor(this));
  }

  final TokenStore tokens;

  final _sessionExpired = StreamController<void>.broadcast();

  /// The auth layer listens to this to sign the user out.
  Stream<void> get sessionExpired => _sessionExpired.stream;

  void dispose() => _sessionExpired.close();

  final Dio _dio;

  /// Separate instance with no interceptors, so a failing refresh
  /// can never recurse into another refresh.
  final Dio _refreshDio;

  static BaseOptions _options() => BaseOptions(
        baseUrl: Config.apiBaseUrl,
        connectTimeout: Config.connectTimeout,
        receiveTimeout: Config.receiveTimeout,
        headers: {'Accept': 'application/json'},
        contentType: Headers.jsonContentType,
      );

  // ---- Public API --------------------------------------------------------

  Future<ApiResponse> get(String path, {Map<String, dynamic>? query}) =>
      _send(() => _dio.get(path, queryParameters: query));

  Future<ApiResponse> post(String path, {Object? body}) =>
      _send(() => _dio.post(path, data: body));

  Future<ApiResponse> put(String path, {Object? body}) =>
      _send(() => _dio.put(path, data: body));

  Future<ApiResponse> patch(String path, {Object? body}) =>
      _send(() => _dio.patch(path, data: body));

  Future<ApiResponse> delete(String path) => _send(() => _dio.delete(path));

  /// Multipart upload with progress (0.0 to 1.0).
  Future<ApiResponse> upload(
    String path, {
    required FormData form,
    void Function(double progress)? onProgress,
  }) =>
      _send(() => _dio.post(
            path,
            data: form,
            options: Options(contentType: 'multipart/form-data'),
            onSendProgress: (sent, total) {
              if (total > 0) onProgress?.call(sent / total);
            },
          ));

  Future<ApiResponse> _send(Future<Response<dynamic>> Function() call) async {
    try {
      final res = await call();
      final parsed = ApiResponse.fromJson(res.data, statusCode: res.statusCode);
      if (!parsed.success) {
        throw ApiError(parsed.message ?? 'Request failed.', statusCode: res.statusCode);
      }
      return parsed;
    } catch (e) {
      throw ApiError.from(e);
    }
  }

  // ---- Token refresh -----------------------------------------------------

  /// Returns the new access token, or null if refreshing is not possible.
  Future<String?> _refreshAccessToken() async {
    final refresh = await tokens.refreshToken;
    if (refresh == null) return null;
    try {
      final res = await _refreshDio.post(
        Endpoints.refresh,
        data: {'refreshToken': refresh},
      );
      // Backend answers { meta, data: "<new access token>" } and does not
      // rotate the refresh token, so the stored one is kept as is.
      final data = ApiResponse.fromJson(res.data, statusCode: res.statusCode).data;
      final access = data is String ? data : AuthData.fromJson(data is Map<String, dynamic> ? data : {}).accessToken;
      if (access.isEmpty) return null;
      await tokens.save(access: access, refresh: refresh);
      return access;
    } catch (_) {
      return null;
    }
  }
}

/// Queued so that if five requests hit 401 at once, only the first one
/// refreshes; the others wait and then reuse the new token.
class _AuthInterceptor extends QueuedInterceptorsWrapper {
  _AuthInterceptor(this.client);

  final ApiClient client;
  static const _retriedFlag = 'auth_retried';

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await client.tokens.accessToken;
    if (token != null && !Endpoints.noRefresh.contains(options.path)) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    final req = err.requestOptions;
    final is401 = err.response?.statusCode == 401;
    final alreadyRetried = req.extra[_retriedFlag] == true;

    if (!is401 || alreadyRetried || Endpoints.noRefresh.contains(req.path)) {
      handler.next(err);
      return;
    }

    // Another queued request may already have refreshed the token.
    final sentToken = (req.headers['Authorization'] as String?)?.replaceFirst('Bearer ', '');
    final current = await client.tokens.accessToken;
    final newToken = (current != null && current != sentToken)
        ? current
        : await client._refreshAccessToken();

    if (newToken == null) {
      await client.tokens.clear();
      client._sessionExpired.add(null);
      handler.next(err);
      return;
    }

    try {
      req.headers['Authorization'] = 'Bearer $newToken';
      req.extra[_retriedFlag] = true;
      // FormData streams can only be read once; rebuild before retrying.
      if (req.data is FormData) req.data = (req.data as FormData).clone();
      final response = await client._refreshDio.fetch(req);
      handler.resolve(response);
    } on DioException catch (e) {
      handler.next(e);
    }
  }
}

final apiClientProvider = Provider<ApiClient>((ref) {
  final client = ApiClient(tokens: ref.watch(tokenStoreProvider));
  ref.onDispose(client.dispose);
  return client;
});
