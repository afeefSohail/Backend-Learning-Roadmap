#if os(Android)
import Foundation
import SwiftUI // SkipSwiftUI @_exports SkipAndroidBridge → SwiftJNI (JClass, jniContext, etc.)

/// Reads a `content://` URI into Data using the Android ContentResolver via JNI.
/// Calls user.auth.ContentUriHelperKt.readContentUri, which uses InputStream.readBytes().
func readAndroidContentURI(_ url: URL) throws -> Data {
    let context = ProcessInfo.processInfo.dynamicAndroidContext()
    guard let ctxPtr = context.toJavaObject(options: []) else {
        throw NSError(domain: "ContentURI", code: -1,
                      userInfo: [NSLocalizedDescriptionKey: "Android context unavailable"])
    }
    return try jniContext {
        let cls = try JClass(name: "user/auth/ContentUriHelperKt")
        guard let methodID = cls.getStaticMethodID(
            name: "readContentUri",
            sig: "(Landroid/content/Context;Ljava/lang/String;)[B"
        ) else {
            throw NSError(domain: "ContentURI", code: -2,
                          userInfo: [NSLocalizedDescriptionKey: "readContentUri not found — is ContentUriHelper.kt compiled?"])
        }
        let byteArrayPtr: JavaObjectPointer = try cls.callStatic(
            method: methodID, options: [],
            args: [ctxPtr.toJavaParameter(options: []), url.absoluteString.toJavaParameter(options: [])]
        )
        let (elements, count) = JNI.jni.getByteArrayElements(byteArrayPtr)
        guard let elements else {
            throw NSError(domain: "ContentURI", code: -3,
                          userInfo: [NSLocalizedDescriptionKey: "Empty byte array for \(url.absoluteString)"])
        }
        defer { JNI.jni.releaseByteArrayElements(byteArrayPtr, elements: elements, mode: .abort) }
        return Data(bytes: elements, count: Int(count))
    }
}
#endif
