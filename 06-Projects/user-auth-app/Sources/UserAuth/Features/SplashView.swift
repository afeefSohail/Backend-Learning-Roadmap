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
        // NavigationStack lives only around the login flow so MyPhotosView's
        // own NavigationStack isn't nested (nested stacks break toolbar items on iOS).
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
                NavigationStack {
                    LoginView(appState: appState)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.teal.ignoresSafeArea())
    }
}
