//
//  LoginViewModel.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import Foundation
import Observation
import SkipFuse

@MainActor
@Observable
public final class AuthViewModel {
    public var email: String = ""
    public var password: String = ""
    public var name: String = ""
    public var isLoading: Bool = false
    public var errorMessage: String?

    @ObservationIgnored
    private let appState: AppState

    init(appState: AppState) {
        self.appState = appState
    }

    public func login() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let response = try await APIClient.shared.send(
                .login(email: email, password: password),
                as: APIResponse<AuthData>.self
            )
            guard let data = response.data else {
                errorMessage = "Invalid server response."
                return
            }

            await APIClient.shared.saveTokens(
                access: data.accessToken,
                refresh: data.refreshToken
            )

            appState.signIn(user: data.user)
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? "Something went wrong."
        }
    }

    public func register() async {
        errorMessage = nil
        isLoading = true

        do {
            _ = try await APIClient.shared.send(
                .register(email: email, password: password, name: name.isEmpty ? nil : name),
                as: APIResponse<User>.self
            )
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? "Something went wrong."
            isLoading = false
            return
        }

        isLoading = false
        await login()
    }
}
