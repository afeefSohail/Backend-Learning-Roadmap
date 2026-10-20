//
//  Endpoint.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation

// SKIP @nobridge
public protocol RequestBody: Encodable, Sendable {}

// SKIP @nobridge
public enum HTTPMethod: String, Sendable {
    case get = "GET"
    case post = "POST"
    case patch = "PATCH"
    case delete = "DELETE"
}

// SKIP @nobridge
public struct Endpoint: Sendable {
    public let path: String
    public let method: HTTPMethod
    public let body: (any RequestBody)?
    public let requiresAuth: Bool
    public let queryItems: [URLQueryItem]?

    public init(
        path: String,
        method: HTTPMethod = .get,
        body: (any RequestBody)? = nil,
        requiresAuth: Bool = false,
        queryItems: [URLQueryItem]? = nil
    ) {
        self.path = path
        self.method = method
        self.body = body
        self.requiresAuth = requiresAuth
        self.queryItems = queryItems
    }

// MARK: - Concrete endpoints, matching the backend route list
    public static func register(email: String, password: String, name: String?) -> Endpoint {
        Endpoint(
            path: "/auth/register",
            method: .post,
            body: RegisterBody(email: email, password: password, name: name)
        )
    }

    public static func login(email: String, password: String) -> Endpoint {
        Endpoint(
            path: "/auth/login",
            method: .post,
            body: LoginBody(email: email, password: password)
        )
    }

    public static func refresh(refreshToken: String) -> Endpoint {
        Endpoint(
            path: "/auth/refresh",
            method: .post,
            body: RefreshBody(refreshToken: refreshToken)
        )
    }

    public static func logout(refreshToken: String) -> Endpoint {
        Endpoint(
            path: "/auth/logout",
            method: .post,
            body: RefreshBody(refreshToken: refreshToken)
        )
    }

    public static let me = Endpoint(path: "/auth/me", requiresAuth: true)

    public static func user(id: Int) -> Endpoint {
        Endpoint(path: "/user/\(id)")
    }

    public static func updateProfile(name: String) -> Endpoint {
        Endpoint(
            path: "/user/me",
            method: .patch,
            body: UpdateUserBody(name: name),
            requiresAuth: true
        )
    }

    public static let deleteAccount = Endpoint(path: "/user/me", method: .delete, requiresAuth: true)

    public static let myPhotos = Endpoint(path: "/user/me/photos", requiresAuth: true)

    public static func userPhotos(id: Int) -> Endpoint {
        Endpoint(path: "/user/photos/\(id)", requiresAuth: true)
    }

    public static func deletePhoto(id: Int) -> Endpoint {
        Endpoint(path: "/user/photos/\(id)", method: .delete, requiresAuth: true)
    }
}

// MARK: - Request body shapes (mirror your Zod schemas)
// SKIP @nobridge
public struct RegisterBody: RequestBody {
    public let email: String
    public let password: String
    public let name: String?
}

// SKIP @nobridge
public struct LoginBody: RequestBody {
    public let email: String
    public let password: String
}

// SKIP @nobridge
public struct RefreshBody: RequestBody {
    public let refreshToken: String
}

// SKIP @nobridge
public struct UpdateUserBody: RequestBody {
    public let name: String
}
