//
//  AppConfig.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation

public enum AppConfig {
    public static let apiBaseURL: URL = {
        // First try to read from Info.plist (which gets API_BASE_URL from UserAuth.xcconfig)
        if let urlString = Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String,
           !urlString.isEmpty,
           let url = URL(string: urlString) {
            return url
        }
        
        // Fallback to environment variable (useful for development)
        #if DEBUG
        if let urlString = ProcessInfo.processInfo.environment["API_BASE_URL"],
           let url = URL(string: urlString) {
            return url
        }
        #endif
        
        // Default development URL — Android emulators reach the host Mac via 10.0.2.2, not localhost
        #if os(Android)
        let defaultURL = "http://10.0.2.2:3000"
        #else
        let defaultURL = "http://localhost:3000"
        #endif
        
        print("⚠️ WARNING: Using default API URL: \(defaultURL)")
        print("⚠️ Set API_BASE_URL in UserAuth.xcconfig for configuration")
        
        guard let url = URL(string: defaultURL) else {
            fatalError("Invalid default API URL")
        }
        
        return url
    }()
}
