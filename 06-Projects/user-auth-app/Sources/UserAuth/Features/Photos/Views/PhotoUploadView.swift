//
//  PhotoUploadView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI
import SkipKit
#if !os(Android)
import PhotosUI
import UniformTypeIdentifiers

// Data.self uses content type "public.data" which PHPickerResult doesn't provide.
// This wrapper explicitly requests JPEG (or PNG/HEIC) so loadTransferable succeeds.
struct PhotoImageTransfer: Transferable {
    let data: Data
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(importedContentType: .jpeg) { PhotoImageTransfer(data: $0) }
        DataRepresentation(importedContentType: .png) { PhotoImageTransfer(data: $0) }
        DataRepresentation(importedContentType: UTType("public.heic")!) { PhotoImageTransfer(data: $0) }
    }
}
#endif

public struct PhotoUploadView: View {
    var viewModel: PhotosViewModel
    @Environment(\.dismiss) var dismiss

    @State var showSourceDialog = false
    @State var showCameraPicker = false
    @State var showLibraryPicker = false
    // Camera output on both platforms; Android library output
    @State var selectedImageURLs: [URL] = []
    @State var cameraImageURL: URL?

    #if !os(Android)
    @State var selectedItems: [PhotosPickerItem] = []
    // iOS library photos stored as Data directly — avoids temp-file write/read failure.
    @State var selectedImageData: [Data] = []
    #endif

    private var selectedCount: Int {
        #if os(Android)
        return selectedImageURLs.count
        #else
        return selectedImageData.count + selectedImageURLs.count
        #endif
    }

    public var body: some View {
        #if os(Android)
        coreContent
            .withMediaPicker(
                type: .library,
                isPresented: $showLibraryPicker,
                allowsMultipleSelection: true,
                selectedImageURLs: $selectedImageURLs
            )
        #else
        coreContent
            .photosPicker(
                isPresented: $showLibraryPicker,
                selection: $selectedItems,
                maxSelectionCount: 10,
                matching: .images
            )
            .onChange(of: selectedItems) { _, newValue in
                Task { await loadSelectedItems(newValue) }
            }
        #endif
    }

    @ViewBuilder
    private var coreContent: some View {
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

                if selectedCount > 0 {
                    Text(selectedCount == 1
                         ? "1 photo selected"
                         : "\(selectedCount) photos selected")
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
                .disabled(selectedCount == 0 || viewModel.isUploading)
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

    #if !os(Android)
    private func loadSelectedItems(_ items: [PhotosPickerItem]) async {
        guard !items.isEmpty else { return }
        var dataArray: [Data] = []
        for item in items {
            if let transfer = try? await item.loadTransferable(type: PhotoImageTransfer.self) {
                dataArray.append(transfer.data)
            }
        }
        selectedImageData = dataArray
        selectedItems = []
    }
    #endif

    private func uploadSelected() async {
        var imageDataArray: [Data] = []

        for url in selectedImageURLs {
            do {
                #if os(Android)
                let data = url.scheme == "content"
                    ? try readAndroidContentURI(url)
                    : try Data(contentsOf: url)
                #else
                let data = try Data(contentsOf: url)
                #endif
                imageDataArray.append(data)
            } catch {
                viewModel.errorMessage = "Could not read photo: \(error.localizedDescription)"
                return
            }
        }

        #if !os(Android)
        imageDataArray.append(contentsOf: selectedImageData)
        #endif

        guard !imageDataArray.isEmpty else { return }
        await viewModel.upload(imageData: imageDataArray)
        if viewModel.errorMessage == nil { dismiss() }
    }
}

