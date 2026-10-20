//
//  PhotoGridCell.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

struct PhotoGridCell: View {
    let photo: Photo

    var body: some View {
        AsyncImage(url: URL(string: photo.url)) { phase in
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
