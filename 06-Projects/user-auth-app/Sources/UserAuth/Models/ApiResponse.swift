//
//  ApiResponse.swift
//  UserAuth
//
//  Created by afeef sohail on 10/08/2026.
//

import Foundation
/// This is top container for all API responses
/// T will be replaced by actual models
// SKIP @nobridge
public struct APIResponse<T>: Codable, Sendable where T: Codable & Sendable {
    public var meta: Meta
    public var data: T?
}

public struct Meta: Codable, Sendable {
    public var code: Int
    public var message: String
}


public struct EmptyData: Codable, Sendable {}
