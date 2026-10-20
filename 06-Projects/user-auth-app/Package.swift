// swift-tools-version: 6.1
// This is a Skip (https://skip.dev) package.
import PackageDescription

let package = Package(
    name: "user-auth-app",
    defaultLocalization: "en",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "UserAuth", type: .dynamic, targets: ["UserAuth"]),
    ],
    dependencies: [
        .package(url: "https://github.com/skiptools/skip.git", from: "1.9.16"),
        .package(url: "https://github.com/skiptools/skip-fuse-ui.git", from: "1.0.0"),
        .package(url: "https://source.skip.dev/skip-kit.git", "0.0.0"..<"2.0.0"),
        .package(url: "https://source.skip.dev/skip-keychain.git", "0.0.0"..<"2.0.0")
    ],
    targets: [
        .target(name: "UserAuth", dependencies: [
            .product(name: "SkipFuseUI", package: "skip-fuse-ui"),
            .product(name: "SkipKit", package: "skip-kit"),
            .product(name: "SkipKeychain", package: "skip-keychain")
            
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
    ]
)
