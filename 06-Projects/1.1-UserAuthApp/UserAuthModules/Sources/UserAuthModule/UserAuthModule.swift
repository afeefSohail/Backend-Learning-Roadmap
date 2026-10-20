import Foundation

public class UserAuthModuleModule {

    public static func createUserAuthModuleType(id: UUID, delay: Double? = nil) async throws -> UserAuthModuleType {
        if let delay = delay {
            try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
        }
        return UserAuthModuleType(id: id)
    }

    /// An example of a type that can be bridged between Swift and Kotlin
    public struct UserAuthModuleType: Identifiable, Hashable, Codable {
        public var id: UUID
    }
}
