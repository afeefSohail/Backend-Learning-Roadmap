import Testing
import Foundation
@testable import UserAuthModule

@Suite struct UserAuthModuleTests {

    @Test func userAuthModule() throws {
        #expect(1 + 2 == 3, "basic test")
    }

    @Test func asyncThrowsFunction() async throws {
        let id = UUID()
        let type: UserAuthModuleModule.UserAuthModuleType = try await UserAuthModuleModule.createUserAuthModuleType(id: id, delay: 0.001)
        #expect(type.id == id)
    }

}
