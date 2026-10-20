//
//  TokenStore.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

//import Foundation
//import Security

//struct TokenStore {
//    private let accessKey = "com.userauthapp.accessToken"
//    private let refreshKey = "com.userauthapp.refreshToken"
//    
//    func save(access: String, refresh: String) {
//        set(access, forKey: accessKey)
//        set(refresh, forKey: refreshKey)
//    }
//    
//    func loadAccess() -> String? { get(accessKey) }
//    func loadRefresh() -> String? { get(refreshKey) }
//    
//    func updateAccess(_ token: String) {
//        set(token, forKey: accessKey)
//    }
//    
//    func clear() {
//        delete(accessKey)
//        delete(refreshKey)
//    }
//    
//    // MARK: - Keychain primitives
//    /// The shared lookup query every operation is built on top of —
//    /// identifies WHICH item in the Keychain we're referring to.
//    private func baseQuery(forKey key: String) -> [String: Any] {
//        [
//            kSecClass as String: kSecClassGenericPassword,
//            kSecAttrAccount as String: key,
//        ]
//    }
//    
//    private func set(_ value: String, forKey key: String) {
//        self.delete(key)
//        
//        var attributes = baseQuery(forKey: key)
//        attributes[kSecValueData as String] = Data(value.utf8)
//        SecItemAdd(attributes as CFDictionary, nil)
//    }
//    
//    private func get(_ key: String) -> String? {
//        var query = baseQuery(forKey: key)
//        query[kSecReturnData as String] = true
//        query[kSecMatchLimit as String] = kSecMatchLimitOne
//
//        var result: AnyObject?
//        let status = SecItemCopyMatching(query as CFDictionary, &result)
//        guard status == errSecSuccess, let data = result as? Data else { return nil }
//        return String(data: data, encoding: .utf8)
//    }
//    
//    private func delete(_ key: String) {
//        let query = baseQuery(forKey: key)
//        SecItemDelete(query as CFDictionary) // overwrite if it already exists
//    }
//}

import Foundation
import SkipKeychain

struct TokenStore {
    private static let accessKey = "accessToken"
    private static let refreshKey = "refreshToken"

    var accessToken: String? {
        do {
           return try Keychain.shared.string(forKey: Self.accessKey)
        } catch {
            // log it, or show an error
            return nil
        }
    }

    var refreshToken: String? {
        
        do {
           return try Keychain.shared.string(forKey: Self.refreshKey)
        } catch {
            // log it, or show an error
            return nil
        }
    }

    func updateAccess(_ token: String) {
        try? Keychain.shared.set(token, forKey: Self.accessKey)
    }
    
    func save(access: String, refresh: String) {
        try? Keychain.shared.set(access, forKey: Self.accessKey)
        try? Keychain.shared.set(refresh, forKey: Self.refreshKey)
    }

    func clear() {
        try? Keychain.shared.removeValue(forKey: Self.accessKey)
        try? Keychain.shared.removeValue(forKey: Self.refreshKey)
    }
}
