//
//  ProfileViewModel.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation
import Observation
import SkipFuse

@MainActor
@Observable
final class ProfileViewModel {
    var user: User?
    var isLoading = false
    var errorMessage: String?
    var isEditing = false
    var editedName: String = ""

    @ObservationIgnored
    private let appState: AppState

    init(appState: AppState) {
        self.appState = appState
    }

    func loadProfile() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let response = try await APIClient.shared.send(.me, as: APIResponse<User>.self)
            guard let user = response.data else { return }
            self.user = user
            editedName = user.name ?? ""
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? error.localizedDescription
        }
    }

    func saveName() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let response = try await APIClient.shared.send(
                .updateProfile(name: editedName),
                as: APIResponse<User>.self
            )
            user = response.data
            isEditing = false
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? error.localizedDescription
        }
    }

    func logout() async {
        if let refreshToken = await APIClient.shared.currentRefreshToken {
            // Even if the server call fails (e.g. offline), still sign out locally.
            _ = try? await APIClient.shared.send(
                .logout(refreshToken: refreshToken),
                as: APIResponse<EmptyData>.self
            )
        }
        await appState.signOut()
    }

    func deleteAccount() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            _ = try await APIClient.shared.send(.deleteAccount, as: APIResponse<EmptyData>.self)
            await appState.signOut()
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? "Failed to delete account."
        }
    }
}
