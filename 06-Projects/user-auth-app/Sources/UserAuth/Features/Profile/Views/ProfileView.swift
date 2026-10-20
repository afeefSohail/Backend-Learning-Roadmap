//
//  ProfileView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

public struct ProfileView: View {
    @State var viewModel: ProfileViewModel
    @State var showDeleteConfirmation = false

    public init(appState: AppState) {
        _viewModel = State(initialValue: ProfileViewModel(appState: appState))
    }

    public var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.user == nil {
                    ProgressView()
                } else if let user = viewModel.user {
                    Form {
                        Section("Account") {
                            LabeledContent("Email", value: user.email)

                            if viewModel.isEditing {
                                TextField("Name", text: $viewModel.editedName)
                            } else {
                                LabeledContent("Name", value: user.name ?? "—")
                            }
                        }

                        if let errorMessage = viewModel.errorMessage {
                            Text(errorMessage)
                                .foregroundStyle(.red)
                        }

                        Section {
                            if viewModel.isEditing {
                                Button("Save") {
                                    Task { await viewModel.saveName() }
                                }
                                Button("Cancel", role: .cancel) {
                                    viewModel.editedName = user.name ?? ""
                                    viewModel.isEditing = false
                                }
                            } else {
                                Button("Edit Name") {
                                    viewModel.isEditing = true
                                }
                            }
                        }

                        Section {
                            Button("Log Out") {
                                Task { await viewModel.logout() }
                            }

                            Button("Delete Account", role: .destructive) {
                                showDeleteConfirmation = true
                            }
                        }
                    }
                } else {
                    Text(viewModel.errorMessage ?? "Something went wrong.")
                }
            }
            .navigationTitle("Profile")
            .task { await viewModel.loadProfile() }
            .confirmationDialog(
                "Delete your account? This cannot be undone.",
                isPresented: $showDeleteConfirmation,
                titleVisibility: .visible
            ) {
                Button("Delete Account", role: .destructive) {
                    Task { await viewModel.deleteAccount() }
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }
}

#if !os(Android)
#Preview {
    ProfileView(appState: AppState())
}
#endif
