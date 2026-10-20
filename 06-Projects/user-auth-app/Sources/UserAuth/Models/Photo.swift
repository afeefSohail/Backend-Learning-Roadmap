//
//  Photo.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation

public struct Photo: Codable, Sendable  {
    public let id: Int
    public let url: String
    public let createdAt: Date
}

//hashable for the collection view
extension Photo: Hashable {
    public static func == (lhs: Photo, rhs: Photo) -> Bool {
        return lhs.id == rhs.id
    }
    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
