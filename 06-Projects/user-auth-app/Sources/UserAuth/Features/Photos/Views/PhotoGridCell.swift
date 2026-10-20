//
//  PhotoGridCell.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

struct PhotoGridCell: View {
    let photo: Photo

    // Backend returns relative paths (/uploads/...) or full URLs.
    // Resolve relative paths against the API base URL so Android uses 10.0.2.2 and iOS uses localhost.
    private var resolvedURL: URL? {
        if photo.url.hasPrefix("http") {
            return URL(string: photo.url)
        }
        return URL(string: photo.url, relativeTo: AppConfig.apiBaseURL)?.absoluteURL
    }

    var body: some View {
        AsyncImage(url: resolvedURL) { phase in
            switch phase {
            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            case .failure:
                #if os(Android)
                Image(systemName: "exclamationmark.triangle")
                    .foregroundStyle(.secondary)
                #else
                Image(systemName: "photo.badge.exclamationmark")
                    .foregroundStyle(.secondary)
                #endif
            case .empty:
                ProgressView()
            @unknown default:
                EmptyView()
            }
        }
        .frame(maxWidth: .infinity, minHeight: 120, maxHeight: 120)
        .clipped()
        .clipShape(.rect(cornerRadius: 8))
    }
}
