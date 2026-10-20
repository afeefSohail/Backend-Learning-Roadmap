//
//  User.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation

public struct User: Codable, Sendable {
    public let id: Int
    public let email: String
    public let name: String?
    public let createdAt: Date
    public var photos: [Photo]? = []
}
