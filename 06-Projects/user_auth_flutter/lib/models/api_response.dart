/// Matches `sendResponse()` in src/utils/response.util.ts:
///
///   { "meta": { "code": 200, "message": "Login successful" }, "data": ... }
///
/// `data` is an object, an array, a bare string (refresh) or null.
class ApiResponse {
  const ApiResponse({required this.code, this.message, this.data});

  final int code;
  final String? message;
  final dynamic data;

  bool get success => code < 400;

  factory ApiResponse.fromJson(dynamic body, {int? statusCode}) {
    if (body is Map<String, dynamic>) {
      final meta = body['meta'];
      if (meta is Map) {
        return ApiResponse(
          code: (meta['code'] as num?)?.toInt() ?? statusCode ?? 200,
          message: meta['message']?.toString(),
          data: body['data'],
        );
      }
      // requireJWTAuth answers 401 with a bare { message } (no meta).
      return ApiResponse(
        code: statusCode ?? 200,
        message: body['message']?.toString(),
        data: body.containsKey('data') ? body['data'] : body,
      );
    }
    return ApiResponse(code: statusCode ?? 200, data: body);
  }

  Map<String, dynamic> get map =>
      data is Map<String, dynamic> ? data as Map<String, dynamic> : const {};

  /// `data` as a list of objects (GET /user/me/photos, POST /user/me/photos).
  List<Map<String, dynamic>> get list {
    final raw = data;
    if (raw is! List) return const [];
    return raw.whereType<Map<String, dynamic>>().toList();
  }
}
