import 'package:dio/dio.dart';

/// One error type for the UI.
///
/// Backend error shapes handled (01-UserAuthBackend):
///  - sendResponse:   { meta: { code, message }, data: null }
///  - validate():     { meta: { code: 400, message: "Validation failed" },
///                      data: [ { field: "body.email", message: "..." } ] }
///  - requireJWTAuth: { message: "Invalid or expired access token" }
///  - multer errors:  Express default HTML page (no JSON) with status 500
class ApiError implements Exception {
  const ApiError(this.message, {this.statusCode, this.fieldErrors = const {}});

  final String message;
  final int? statusCode;

  /// Zod issues keyed by field ("email", "password", "name").
  final Map<String, String> fieldErrors;

  bool get isUnauthorized => statusCode == 401;

  factory ApiError.from(Object error) {
    if (error is ApiError) return error;
    if (error is DioException) {
      if (error.error is ApiError) return error.error as ApiError;
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return const ApiError('The server took too long to respond.');
        case DioExceptionType.connectionError:
          return const ApiError(
              'Cannot reach the server. Check that Docker is running and the base URL is correct.');
        case DioExceptionType.cancel:
          return const ApiError('Request cancelled.');
        default:
          break;
      }
      final status = error.response?.statusCode;
      final body = error.response?.data;
      String? message;
      final fields = <String, String>{};

      if (body is Map) {
        final meta = body['meta'];
        message = (meta is Map ? meta['message'] : body['message'])?.toString();
        final data = body['data'];
        if (data is List) {
          for (final issue in data.whereType<Map>()) {
            final field = issue['field']?.toString().replaceFirst('body.', '') ?? '';
            final msg = issue['message']?.toString() ?? '';
            // Keep the first message per field (Zod may report several).
            if (field.isNotEmpty && msg.isNotEmpty) fields.putIfAbsent(field, () => msg);
          }
          // "Validation failed" is vague; show the first real reason instead.
          if (fields.isNotEmpty) message = fields.values.first;
        }
      }
      return ApiError(message ?? _defaultMessage(status), statusCode: status, fieldErrors: fields);
    }
    return ApiError(error.toString());
  }

  static String _defaultMessage(int? status) => switch (status) {
        400 => 'The request was invalid.',
        401 => 'Your session has expired. Please sign in again.',
        403 => 'You do not have permission to do that.',
        404 => 'Not found.',
        409 => 'Email already in use.',
        int s when s >= 500 => 'Server error. Please try again later.',
        _ => 'Something went wrong.',
      };

  @override
  String toString() => message;
}
