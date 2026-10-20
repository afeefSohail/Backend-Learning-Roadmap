//
//  APIClient.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public actor APIClient {
    public static let shared = APIClient()
    private let baseURL: URL
    private let tokenStore = TokenStore()
    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }()
    
    public var currentRefreshToken: String? {
        tokenStore.refreshToken
    }

    private var isRefreshing = false

    public init(baseURL: URL = AppConfig.apiBaseURL) {
        self.baseURL = baseURL
    }

    // MARK: - Public entry point
    // SKIP @nobridge
    public func send<T: Decodable>(_ endpoint: Endpoint, as type: T.Type) async throws -> T {
        do {
            return try await execute(endpoint, as: type)
        } catch APIError.unauthorized where endpoint.requiresAuth {
            try await refreshAccessToken()
            return try await execute(endpoint, as: type) // retry once
        }
    }

    // MARK: - Core request execution
     private func execute<T: Decodable>(_ endpoint: Endpoint, as type: T.Type) async throws -> T {
        var url = baseURL.appendingPathComponent(endpoint.path)
        if let items = endpoint.queryItems, !items.isEmpty {
            var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
            components.queryItems = items
            url = components.url!
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if endpoint.requiresAuth, let token = tokenStore.accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = endpoint.body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONEncoder().encode(AnyEncodable(body))
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw APIError.unknown }

        switch http.statusCode {
        case 200...299:
            do {
                return try decoder.decode(T.self, from: data)
            } catch {
                logger.error("Decode error for \(endpoint.path): \(error)")
                throw APIError.decoding
            }
        case 401:
            throw APIError.unauthorized
        case 404:
            throw APIError.notFound
        case 409:
            let msg = (try? decoder.decode(APIErrorBody.self, from: data))?.message ?? "Conflict"
            throw APIError.conflict(msg)
        case 400, 422:
            let msg = (try? decoder.decode(APIErrorBody.self, from: data))?.message ?? "Invalid request"
            throw APIError.validationFailed(msg)
        default:
            let msg = (try? decoder.decode(APIErrorBody.self, from: data))?.message ?? "Server error"
            throw APIError.server(msg)
        }
    }
    
    // MARK: - MultiPart file uploading
    // SKIP @nobridge
    public func uploadPhotos(_ imageDataArray: [Data]) async throws -> APIResponse<[Photo]> {
        let url = baseURL.appendingPathComponent("/user/me/photos")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        guard let token = tokenStore.accessToken else { throw APIError.unauthorized }
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()
        for (index, imageData) in imageDataArray.enumerated() {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append(
                "Content-Disposition: form-data; name=\"photos\"; filename=\"photo\(index).jpg\"\r\n"
                    .data(using: .utf8)!
            )
            body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
            body.append(imageData)
            body.append("\r\n".data(using: .utf8)!)
        }
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw APIError.server("Upload failed")
        }

        return try decoder.decode(APIResponse<[Photo]>.self, from: data)
    }

    // MARK: - Refresh handling (single-flight, avoids parallel refresh storms)

    private func refreshAccessToken() async throws {
        guard !isRefreshing else { throw APIError.unauthorized }
        isRefreshing = true
        defer { isRefreshing = false }

        guard let refreshToken = tokenStore.refreshToken else {
            tokenStore.clear()
            throw APIError.unauthorized
        }

        do {
            let response = try await execute(
                .refresh(refreshToken: refreshToken),
                as: APIResponse<String>.self
            )
            tokenStore.updateAccess(response.data ?? "")
        } catch {
            tokenStore.clear()
            throw APIError.unauthorized
        }
    }

    public func saveTokens(access: String, refresh: String) {
        tokenStore.save(access: access, refresh: refresh)
    }

    public func clearTokens() {
        tokenStore.clear()
    }

    public var hasStoredSession: Bool {
        tokenStore.refreshToken != nil
    }
}

// Helper to encode any Encodable without knowing its concrete type upfront
// Solves closure concurrency tracking completely by using a type-erased generic box wrapper
private struct AnyEncodable: Encodable, Sendable {
    private let _encode: @Sendable (Encoder) throws -> Void

    init<T: Encodable & Sendable>(_ wrapped: T) {
        self._encode = { @Sendable encoder in
            try wrapped.encode(to: encoder)
        }
    }

    func encode(to encoder: Encoder) throws {
        try _encode(encoder)
    }
}

