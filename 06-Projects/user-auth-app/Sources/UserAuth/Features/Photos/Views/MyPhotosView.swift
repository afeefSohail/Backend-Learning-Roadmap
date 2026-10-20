//
//  MyPhotosView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

public struct MyPhotosView: View {
    @State var viewModel = PhotosViewModel()
    @State var showUpload = false

    private let columns = [
        GridItem(.flexible(), spacing: 4),
        GridItem(.flexible(), spacing: 4),
        GridItem(.flexible(), spacing: 4),
    ]

    /// Real binding: dismissing the alert clears the error
    private var showError: Binding<Bool> {
        Binding(
            get: { viewModel.errorMessage != nil },
            set: { if !$0 { viewModel.errorMessage = nil } }
        )
    }

    public var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.photos.isEmpty {
                    ProgressView()
                } else if viewModel.photos.isEmpty {
//                    ContentUnavailableView(
//                        "No Photos Yet",
//                        systemImage: "photo.on.rectangle",
//                        description: Text("Tap + to upload your first photo.")
//                    )
                    VStack(spacing: 8) {
                        #if os(Android)
                        Image(systemName: "list.bullet")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        #else
                        Image(systemName: "photo.on.rectangle")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        #endif
                        Text("No Photos Yet")
                            .font(.headline)
                        Text("Tap + to upload your first photo.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 4) {
                            ForEach(viewModel.photos, id: \.id) { photo in
                                PhotoGridCell(photo: photo)
                                    .contextMenu {
                                        Button("Delete", role: .destructive) {
                                            Task { await viewModel.delete(photo: photo) }
                                        }
                                    }
                            }
                        }
                        .padding(4)
                    }
                }
            }
            .navigationTitle("My Photos")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    Button {
                        showUpload = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showUpload) {
                PhotoUploadView(viewModel: viewModel)
            }
            .task { await viewModel.loadPhotos() }
            .alert("Error", isPresented: showError) {
                Button("OK") { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
//            .alert(
//                "Error",
//                isPresented: showError,
//                actions: { Button("OK") { viewModel.errorMessage = nil } },
//                message: { Text(viewModel.errorMessage ?? "") }
//            )
            
        }
    }
}
