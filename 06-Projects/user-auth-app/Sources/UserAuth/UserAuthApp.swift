import Foundation
import SkipFuse
import SwiftUI

/// A logger for the UserAuth module.
let logger: Logger = Logger(subsystem: "com.afeef.userauth", category: "UserAuth")

/// The shared top-level view for the app, bridged to Android via Skip.
///
/// This is the main entry point that both iOS and Android will use.
// SKIP @bridge
public struct UserAuthRootView: View {
    public init() {
    }

    public var body: some View {
        UserAuthContentView()
    }
}

/// Internal content view that manages AppState
struct UserAuthContentView: View {
    @State var appState = AppState()

    var body: some View {
        SplashView()
            .environment(appState)
            .task {
                await appState.restoreSession()
                logger.info("Skip app logs are viewable in the Xcode console for iOS; Android logs can be viewed in Studio or using adb logcat")
            }
    }
}

/// Global application delegate functions.
///
/// These functions can update a shared observable object to communicate app state changes to interested views.
public final class UserAuthAppDelegate: Sendable {
    public static let shared = UserAuthAppDelegate()

    private init() {
    }

    public func onInit() {
        logger.debug("onInit")
    }

    public func onLaunch() {
        logger.debug("onLaunch")
    }

    public func onResume() {
        logger.debug("onResume")
    }

    public func onPause() {
        logger.debug("onPause")
    }

    public func onStop() {
        logger.debug("onStop")
    }

    public func onDestroy() {
        logger.debug("onDestroy")
    }

    public func onLowMemory() {
        logger.debug("onLowMemory")
    }
}
