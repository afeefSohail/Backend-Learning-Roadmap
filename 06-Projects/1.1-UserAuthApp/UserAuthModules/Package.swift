// swift-tools-version: 6.1
// This is a Skip (https://skip.dev) package.
import PackageDescription

let package = Package(
    name: "UserAuthModules",
    defaultLocalization: "en",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "UserAuthModule", type: .dynamic, targets: ["UserAuthModule"]),
    ],
    dependencies: [
        .package(url: "https://github.com/skiptools/skip.git", from: "1.9.16"),
        .package(url: "https://github.com/skiptools/skip-fuse.git", from: "1.0.0")
    ],
    targets: [
        .target(name: "UserAuthModule", dependencies: [
            .product(name: "SkipFuse", package: "skip-fuse")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
        .testTarget(name: "UserAuthModuleTests", dependencies: [
            "UserAuthModule",
            .product(name: "SkipTest", package: "skip")
        ], resources: [.process("Resources")], plugins: [.plugin(name: "skipstone", package: "skip")]),
    ]
)
