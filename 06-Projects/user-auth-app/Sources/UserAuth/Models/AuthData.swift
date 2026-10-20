//
//  AuthData.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation
public struct AuthData: Codable, Sendable {
    public let user: User
    public let accessToken: String
    public let refreshToken: String
}

