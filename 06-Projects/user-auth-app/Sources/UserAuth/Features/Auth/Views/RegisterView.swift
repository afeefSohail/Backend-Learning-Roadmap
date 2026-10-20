//
//  RegisterView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//

import SwiftUI

struct RegisterView: View {
    @Bindable var viewModel: AuthViewModel   // owned by LoginView, shared here

    var body: some View {
        VStack(spacing: 16) {
            Text("Create Account")
                .font(.largeTitle.bold())

            TextField("Name (optional)", text: $viewModel.name)
                .textContentType(.name)
                .textFieldStyle(.roundedBorder)

            #if !os(macOS)
            TextField("Email", text: $viewModel.email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .textFieldStyle(.roundedBorder)
            #else
            TextField("Email", text: $viewModel.email)
                .textContentType(.emailAddress)
                .autocorrectionDisabled()
                .textFieldStyle(.roundedBorder)
            #endif

            SecureField("Password", text: $viewModel.password)
                .textContentType(.newPassword)
                .textFieldStyle(.roundedBorder)

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .foregroundStyle(.red)
                    .font(.footnote)
            }

            Button {
                Task { await viewModel.register() }
            } label: {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Text("Register")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(viewModel.email.isEmpty || viewModel.password.isEmpty || viewModel.isLoading)
        }
        .padding()
    }
}
