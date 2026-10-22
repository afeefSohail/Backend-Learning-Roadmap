/// Backend paths, matched to 01-UserAuthBackend (src/app.ts + src/routes/*).
///
///   app.use("/auth", authRouter)
///   app.use("/user", [userRouter, photoRouter])
class Endpoints {
  Endpoints._();

  // auth.routes.ts
  static const register = '/auth/register'; // POST { email, password, name? }
  static const login = '/auth/login'; //       POST { email, password }
  static const refresh = '/auth/refresh'; //   POST { refreshToken } -> data: "<accessToken>"
  static const logout = '/auth/logout'; //     POST { refreshToken }
  static const me = '/auth/me'; //             GET  (Bearer)

  // user.routes.ts
  static const profile = '/user/me'; //        PATCH { name } | DELETE (Bearer)
  static String publicUser(String id) => '/user/$id'; // GET, no auth

  // photo.routes.ts
  static const myPhotos = '/user/me/photos'; // GET | POST multipart "photos" (max 10)
  static String photo(String id) => '/user/photos/$id'; // GET | DELETE (Bearer)

  /// Requests that must never trigger the refresh-and-retry logic.
  static const noRefresh = {login, register, refresh, logout};
}
