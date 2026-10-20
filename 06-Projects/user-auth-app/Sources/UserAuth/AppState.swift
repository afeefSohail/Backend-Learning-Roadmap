import SwiftUI
import SkipFuse

public enum AuthState: Sendable {
    case checking
    case authenticated
    case unauthenticated
}

@MainActor
@Observable
public final class AppState {
    var authState: AuthState = .checking
    var user: User?
    
    public init() {
        // Left empty intentionally to act as your default initializer
    }
    
    public var isAuthenticated: Bool { authState == .authenticated }

    public func restoreSession() async {
        guard await APIClient.shared.hasStoredSession else {
            authState = .unauthenticated
            return
        }

        do {
            let response = try await APIClient.shared.send(.me, as: APIResponse<User>.self)
            user = response.data
            authState = .authenticated
        } catch APIError.unauthorized {
            // Session is really invalid: clear tokens
            await APIClient.shared.clearTokens()
            authState = .unauthenticated
        } catch {
            // Network/server problem: keep tokens, don't log the user out
            authState = .unauthenticated
        }
    }

    public func signIn(user: User) {
        self.user = user
        authState = .authenticated
    }

    public func signOut() async {
        await APIClient.shared.clearTokens()
        user = nil
        authState = .unauthenticated
    }
}
