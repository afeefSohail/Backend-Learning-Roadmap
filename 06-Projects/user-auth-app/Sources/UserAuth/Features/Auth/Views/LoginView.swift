//
//  LoginView.swift
//  UserAuth
//
//  Created by afeef sohail on 08/08/2026.
//
import SwiftUI

public struct LoginView: View {
    @State var viewModel: AuthViewModel

    public init(appState: AppState) {
        _viewModel = State(initialValue: AuthViewModel(appState: appState))
    }

    public var body: some View {
        VStack(spacing: 16) {
            Text("Log In")
                .font(.largeTitle.bold())

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
                .textContentType(.password)
                .textFieldStyle(.roundedBorder)

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .foregroundStyle(.red)
                    .font(.footnote)
            }

            Button {
                Task { await viewModel.login() }
            } label: {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Text("Log In")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(viewModel.email.isEmpty || viewModel.password.isEmpty || viewModel.isLoading)

            NavigationLink("Don't have an account? Register") {
                RegisterView(viewModel: viewModel)
            }
            .font(.footnote)
        }
        .padding()
    }
}

#if !os(Android)
#Preview {
    NavigationStack { LoginView(appState: AppState()) }
}
#endif
