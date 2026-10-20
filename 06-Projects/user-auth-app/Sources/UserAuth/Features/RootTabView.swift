//
//  RootTabView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

public struct RootTabView: View {
    @Environment(AppState.self) var appState

    public init() {}

    public var body: some View {
        TabView {
            ProfileView(appState: appState)
                .tabItem { Label("Profile", systemImage: "person.crop.circle") }

            MyPhotosView()
                .tabItem {
                    #if os(Android)
                    Label("Photos", systemImage: "list.bullet")
                    #else
                    Label("Photos", systemImage: "photo.on.rectangle")
                    #endif
                }
        }
    }
}
