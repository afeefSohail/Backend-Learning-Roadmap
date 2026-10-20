//
//  SplashView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

/// The splash screen that handles authentication state routing
public struct SplashView: View {
    @Environment(AppState.self) var appState

    public init() {}

    public var body: some View {
        NavigationStack {
            Group {
                switch appState.authState {
                case .checking:
                    #if !SKIP_BRIDGE
                    ProgressView()
                        .controlSize(.large)
                        .tint(.white)
                    #else
                    ProgressView()
                        .tint(.white)
                    #endif
                case .authenticated:
                    RootTabView()
                case .unauthenticated:
                    LoginView(appState: appState)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.teal.ignoresSafeArea())
        }
    }
}
