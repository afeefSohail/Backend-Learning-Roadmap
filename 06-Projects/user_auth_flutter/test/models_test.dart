import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:user_auth/core/networking/api_error.dart';
import 'package:user_auth/features/auth/validators.dart';
import 'package:user_auth/models/api_response.dart';
import 'package:user_auth/models/auth_data.dart';
import 'package:user_auth/models/user.dart';

/// Payloads copied from the shapes 01-UserAuthBackend sends.
void main() {
  test('login: { meta, data: { user, accessToken, refreshToken } }', () {
    final res = ApiResponse.fromJson({
      'meta': {'code': 200, 'message': 'Login successful'},
      'data': {
        'user': {
          'id': 7,
          'email': 'afeef@example.com',
          'name': 'Afeef Sohail',
          'createdAt': '2026-08-01T18:02:24.000Z',
          'photos': [
            {'id': 1, 'url': '/uploads/1792502227443-523573926.jpg', 'userId': 7, 'createdAt': '2026-10-19T10:00:00.000Z', 'updatedAt': null},
          ],
        },
        'accessToken': 'a',
        'refreshToken': 'r',
      },
    });
    expect(res.success, isTrue);
    final auth = AuthData.fromJson(res.map);
    expect(auth.accessToken, 'a');
    expect(auth.user?.id, '7');
    expect(auth.user?.initials, 'AS');
    expect(auth.user?.photos.single.url, endsWith('/uploads/1792502227443-523573926.jpg'));
    expect(auth.user?.photos.single.url, startsWith('http'));
  });

  test('refresh: data is a bare access token string', () {
    final res = ApiResponse.fromJson({
      'meta': {'code': 200, 'message': 'Access token generated successfully!'},
      'data': 'new-access-token',
    });
    expect(res.data, 'new-access-token');
  });

  test('photos list: data is an array', () {
    final res = ApiResponse.fromJson({
      'meta': {'code': 200, 'message': 'Photos retrieved successfully'},
      'data': [{'id': 1, 'url': '/uploads/a.jpg'}, {'id': 2, 'url': '/uploads/b.jpg'}],
    });
    expect(res.list.length, 2);
  });

  test('user with null name falls back to email', () {
    final u = User.fromJson({'id': 1, 'email': 'zed@x.io', 'name': null});
    expect(u.hasName, isFalse);
    expect(u.initials, 'Z');
    expect(u.displayName, 'zed');
  });

  test('Zod validation errors map to fields', () {
    final err = ApiError.from(DioException(
      requestOptions: RequestOptions(path: '/auth/register'),
      type: DioExceptionType.badResponse,
      response: Response(
        requestOptions: RequestOptions(path: '/auth/register'),
        statusCode: 400,
        data: {
          'meta': {'code': 400, 'message': 'Validation failed'},
          'data': [
            {'field': 'body.password', 'message': 'Password must contain at least one number'},
          ],
        },
      ),
    ));
    expect(err.fieldErrors['password'], 'Password must contain at least one number');
    expect(err.message, 'Password must contain at least one number');
  });

  test('auth middleware 401 has bare { message }', () {
    final err = ApiError.from(DioException(
      requestOptions: RequestOptions(path: '/auth/me'),
      type: DioExceptionType.badResponse,
      response: Response(
        requestOptions: RequestOptions(path: '/auth/me'),
        statusCode: 401,
        data: {'message': 'Invalid or expired access token'},
      ),
    ));
    expect(err.isUnauthorized, isTrue);
    expect(err.message, 'Invalid or expired access token');
  });

  test('validators mirror auth.validators.ts', () {
    expect(Validators.newPassword('short1A'), isNotNull);
    expect(Validators.newPassword('longenough1'), isNotNull); // no uppercase
    expect(Validators.newPassword('Longenough'), isNotNull); // no number
    expect(Validators.newPassword(' Longenough1'), isNotNull); // leading space
    expect(Validators.newPassword('Longenough1'), isNull);
    expect(Validators.optionalName(''), isNull);
    expect(Validators.optionalName('Ali'), isNotNull);
    expect(Validators.optionalName('Afeef'), isNull);
  });
}
