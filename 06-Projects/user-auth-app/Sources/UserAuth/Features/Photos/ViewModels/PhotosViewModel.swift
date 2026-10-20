//
//  PhotosViewModel.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation
import Observation
import SkipFuse

@MainActor
@Observable
public final class PhotosViewModel {
    public var photos: [Photo] = []
    public var isLoading = false
    public var isUploading = false
    public var errorMessage: String?

    public func loadPhotos() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let response = try await APIClient.shared.send(.myPhotos, as: APIResponse<[Photo]>.self)
            photos = response.data ?? []
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? "Failed to load photos."
        }
    }

    public func upload(imageData: [Data]) async {
        errorMessage = nil
        isUploading = true
        defer { isUploading = false }

        do {
            let response = try await APIClient.shared.uploadPhotos(imageData)
            photos = response.data ?? []
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? "Upload failed."
        }
    }

    public func delete(photo: Photo) async {
        // Optimistic removal; roll back if the server call fails
        let savedOriginalPhotos = photos
        photos.removeAll { $0.id == photo.id }

        do {
            _ = try await APIClient.shared.send(.deletePhoto(id: photo.id), as: APIResponse<EmptyData>.self)
        } catch {
            photos = savedOriginalPhotos
            errorMessage = (error as? APIError)?.errorDescription ?? "Failed to delete photo."
        }
    }
}
