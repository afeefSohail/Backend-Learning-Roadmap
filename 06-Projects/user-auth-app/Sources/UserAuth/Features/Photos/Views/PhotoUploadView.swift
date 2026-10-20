//
//  PhotoUploadView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI
import SkipKit

public struct PhotoUploadView: View {
    var viewModel: PhotosViewModel
    @Environment(\.dismiss) var dismiss

    @State  var showSourceDialog = false
    @State  var showLibraryPicker = false
    @State  var showCameraPicker = false
    @State  var selectedImageURLs: [URL] = []
    @State  var cameraImageURL: URL?

    public var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Button {
                    showSourceDialog = true
                } label: {
                    #if os(Android)
                    Label("Add Photos", systemImage: "square.and.arrow.up")
                        .font(.headline)
                    #else
                    Label("Add Photos", systemImage: "photo.on.rectangle.angled")
                        .font(.headline)
                    #endif
                }
                .buttonStyle(.borderedProminent)
                .confirmationDialog("Choose Source", isPresented: $showSourceDialog, titleVisibility: .visible) {
                    Button("Camera") { showCameraPicker = true }
                    Button("Photo Library") { showLibraryPicker = true }
                    Button("Cancel", role: .cancel) {}
                }

                if !selectedImageURLs.isEmpty {
                    Text(selectedImageURLs.count == 1
                         ? "1 photo selected"
                         : "\(selectedImageURLs.count) photos selected")
                        .foregroundStyle(.secondary)
                }

                if viewModel.isUploading {
                    ProgressView("Uploading...")
                }

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage).foregroundStyle(.red)
                }

                Spacer()

                Button("Upload") {
                    Task { await uploadSelected() }
                }
                .buttonStyle(.borderedProminent)
                .disabled(selectedImageURLs.isEmpty || viewModel.isUploading)
            }
            .padding()
            .navigationTitle("Upload Photos")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
        .withMediaPicker(
            type: .library,
            isPresented: $showLibraryPicker,
            allowsMultipleSelection: true,
            selectedImageURLs: $selectedImageURLs
        )
        .withMediaPicker(
            type: .camera,
            isPresented: $showCameraPicker,
            selectedImageURL: $cameraImageURL
        )
        .onChange(of: cameraImageURL) { url in
            if let url {
                selectedImageURLs.append(url)
                cameraImageURL = nil
            }
        }
    }

    private func uploadSelected() async {
        let imageDataArray = selectedImageURLs.compactMap { try? Data(contentsOf: $0) }
        guard !imageDataArray.isEmpty else { return }
        await viewModel.upload(imageData: imageDataArray)
        if viewModel.errorMessage == nil { dismiss() }
    }
}
