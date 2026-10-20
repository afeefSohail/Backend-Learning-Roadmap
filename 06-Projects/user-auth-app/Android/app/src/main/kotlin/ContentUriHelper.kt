package user.auth

import android.content.Context
import java.io.IOException

/**
 * Reads an Android content:// URI entirely into memory and returns the bytes.
 * Called from native Swift via JNI in PhotoUploadView.
 */
@Throws(IOException::class)
fun readContentUri(context: Context, uriString: String): ByteArray {
    val uri = android.net.Uri.parse(uriString)
    val stream = context.contentResolver.openInputStream(uri)
        ?: throw IOException("Cannot open content URI: $uriString")
    return stream.use { it.readBytes() }
}
