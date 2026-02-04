package com.patrn

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.OpenableColumns
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream

class FilePickerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    init {
        // Store the activity reference for later use in startActivityForResult
        FilePickerHelper.setActivity(reactContext.currentActivity as? Activity)
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun pickFile(multiple: Boolean, mimeTypes: ReadableArray, promise: Promise) {
        try {
            // Store the promise for callback
            FilePickerHelper.setPromise(promise)
            FilePickerHelper.setAllowMultiple(multiple)

            val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                type = if (mimeTypes.size() > 0) mimeTypes.getString(0) else "*/*"
                putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple)
                addCategory(Intent.CATEGORY_OPENABLE)
            }

            val chooserIntent = Intent.createChooser(intent, "Select a file")
            
            val activity = FilePickerHelper.getActivity()
            if (activity != null) {
                activity.startActivityForResult(chooserIntent, PICK_FILE_REQUEST_CODE)
            } else {
                promise.reject("ERROR", "No activity available")
                FilePickerHelper.clear()
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
            FilePickerHelper.clear()
        }
    }

    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != PICK_FILE_REQUEST_CODE) {
            return
        }

        val promise = FilePickerHelper.getPromise()
        val allowMultiple = FilePickerHelper.getAllowMultiple()

        if (resultCode == Activity.RESULT_CANCELED) {
            promise?.reject("CANCELLED", "File picker cancelled")
            FilePickerHelper.clear()
            return
        }

        if (resultCode != Activity.RESULT_OK || data == null) {
            promise?.reject("ERROR", "No file selected")
            FilePickerHelper.clear()
            return
        }

        try {
            val files = mutableListOf<WritableMap>()

            if (allowMultiple && data.clipData != null) {
                val clipData = data.clipData!!
                for (i in 0 until clipData.itemCount) {
                    val uri = clipData.getItemAt(i).uri
                    val fileInfo = getFileInfo(uri)
                    if (fileInfo != null) {
                        files.add(fileInfo)
                    }
                }
            } else if (data.data != null) {
                val uri = data.data!!
                val fileInfo = getFileInfo(uri)
                if (fileInfo != null) {
                    files.add(fileInfo)
                }
            }

            if (files.isNotEmpty()) {
                promise?.resolve(Arguments.createArray().apply {
                    files.forEach { pushMap(it) }
                })
            } else {
                promise?.reject("ERROR", "No files selected")
            }
        } catch (e: Exception) {
            promise?.reject("ERROR", e.message)
        } finally {
            FilePickerHelper.clear()
        }
    }

    private fun getFileInfo(uri: Uri): WritableMap? {
        return try {
            val contentResolver = reactApplicationContext.contentResolver
            var fileName: String
            var fileSize: Long

            contentResolver.query(uri, null, null, null, null)?.use { cursor ->
                val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
                cursor.moveToFirst()
                fileName = cursor.getString(nameIndex)
                fileSize = cursor.getLong(sizeIndex)
            } ?: run {
                fileName = uri.lastPathSegment ?: "file"
                fileSize = 0L
            }

            val mimeType = contentResolver.getType(uri) ?: "*/*"
            val filePath = copyFileToCache(uri, fileName)

            Arguments.createMap().apply {
                putString("uri", filePath)
                putString("name", fileName)
                putString("type", mimeType)
                putDouble("size", fileSize.toDouble())
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    private fun copyFileToCache(uri: Uri, fileName: String): String {
        val cacheDir = reactApplicationContext.cacheDir
        val file = File(cacheDir, fileName)

        reactApplicationContext.contentResolver.openInputStream(uri)?.use { input ->
            FileOutputStream(file).use { output ->
                input.copyTo(output)
            }
        }

        return "file://" + file.absolutePath
    }

    companion object {
        private const val PICK_FILE_REQUEST_CODE = 1001
        const val NAME = "FilePickerModule"
    }
}

// Helper object to store promise across activity transitions
object FilePickerHelper {
    private var promise: Promise? = null
    private var allowMultiple: Boolean = false
    private var activity: Activity? = null

    fun setPromise(p: Promise) {
        promise = p
    }

    fun getPromise(): Promise? = promise

    fun setAllowMultiple(multiple: Boolean) {
        allowMultiple = multiple
    }

    fun getAllowMultiple(): Boolean = allowMultiple

    fun setActivity(act: Activity?) {
        activity = act
    }

    fun getActivity(): Activity? = activity

    fun clear() {
        promise = null
        allowMultiple = false
    }
}
