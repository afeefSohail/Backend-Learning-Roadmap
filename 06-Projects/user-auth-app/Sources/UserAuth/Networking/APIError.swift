//
//  APIError.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation

public enum APIError: Error, LocalizedError, Sendable {
    case unauthorized
    case validationFailed(String)
    case notFound
    case conflict(String)
    case server(String)
    case decoding
    case unknown

    public var errorDescription: String? {
        switch self {
        case .unauthorized: return "You're not signed in, or your session expired."
        case .validationFailed(let msg): return msg
        case .notFound: return "Not found."
        case .conflict(let msg): return msg
        case .server(let msg): return msg
        case .decoding: return "Something went wrong reading the server's response."
        case .unknown: return "Something went wrong."
        }
    }
}

// Matches your backend's { success: false, message: "..." } shape
public struct APIErrorBody: Decodable, Sendable {
    public let message: String?
    public let error: String?
}
