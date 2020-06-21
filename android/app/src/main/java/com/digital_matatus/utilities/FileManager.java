package com.digital_matatus.utilities;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;

import android.provider.MediaStore;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

public class FileManager extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;
  private ContentResolver contentResolver;

  // App folders
  private final File PICTURES; // Pictures folder in User's Phone
  private final File DIGITAL_MATATUS_FOLDER; // DigitalMatatus folder
  private final File DIGITAL_MATATUS_IMAGES; // images directory
  private final File DIGITAL_MATATUS_VIDEOS; // videos directory

  // File operations consatnts
  private final Map<String, Object> constants = new HashMap<>();

  public FileManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
    contentResolver = reactContext.getContentResolver();

    // initialise folders
    PICTURES = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
    DIGITAL_MATATUS_FOLDER = new File(PICTURES, "DigitalMatatus");
    DIGITAL_MATATUS_IMAGES = new File(DIGITAL_MATATUS_FOLDER, "images");
    DIGITAL_MATATUS_VIDEOS = new File(DIGITAL_MATATUS_FOLDER, "videos");

    // create DigitalMatatus folders if they doesn't exist
    if(!DIGITAL_MATATUS_FOLDER.exists()) {
      try {
        if(DIGITAL_MATATUS_FOLDER.mkdir()) {
          DIGITAL_MATATUS_IMAGES.mkdir();
          DIGITAL_MATATUS_VIDEOS.mkdir();
        }
      } catch (Exception e) { // Exception not handled
      }
    }

    // constants to be exposed to JS through Bridge
    constants.put("ERR_FINDING_TYPE", "ERR_FINDING_TYPE");
    constants.put("IMAGE", "IMAGE"); // images constant
    constants.put("VIDEO", "VIDEO"); // video constant
    constants.put("WRITE_ERR", "WRITE_ERR"); // error copying flag
    constants.put("WRITE_SUCCESS", "WRITE_SUCCESS"); //success writing flag
    constants.put("READ_ERR", "READ_ERR"); // flag when an error occurs when reading
    constants.put("READ_SUCCESS", "READ_SUCCESS"); // flag when the data is read successfully
  }

  @NonNull
  @Override
  public String getName() {

    return "FileManager";
  }

  @Override
  public Map<String, Object> getConstants() {

    return constants;
  }

  /**
   * This method is used to find the MIME type of the File over the JSBridge, this will be very useful
   * when uploading the media to the server.
   *
   * @param uri this is the uri of the file whose content type is in question
   * @param details <b>Callback</b> invoked after the the function finishes executing
   */
  @ReactMethod
  public void getContentType(String uri, Callback details) {
    Uri fileUri = Uri.parse(uri);

    // send back the MIME type of the file in question
    details.invoke(contentResolver.getType(fileUri));
  }

  /**
   * This method is used to copy files to the <code>this.DIGITAL_MATATUS_FOLDER</code> hence make
   * it easier to access for the app in general.
   * This method will be called through the JSBridge as it tries to copy all the images saved by
   * <code>RNCamera</code> to the internal cache directory and return the new file location
   * so that both the App and the user are able to access them afterwards easily.
   *
   * @param uri contains the URI to the path of the image/video that is to be copied
   *            this can be converted to the the "file://" uri can be split to get other
   *            resources such as the File extension name to avoid data getting lost in translation.
   * @param type this is the type of Media being saved to the DIGITAL_MATATUS_FOLDER (makes it easier)
   *             to know which dir to access.
   */
  @ReactMethod
  private void copyMediaFile(String uri, String type) {

      // dispatch a thread to reduce the computation cost on the main thread
      WorkerThread workerThread = new WorkerThread(uri, type, reactContext);
      Thread copyThread = new Thread(workerThread);
      copyThread.start();
//    if(Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {

//      Uri fileUri = Uri.parse(uri);
//      String[] segments = uri.split("/");
//      String ext = segments[(segments.length - 1)];
//      // get the fileName and the fileExtension
//      String fileName = new File(
//              uri.split("file://")[1] // file absolute location
//      ).getName(); // get the fileName
////    String fileExtension = fileName.split(".")[1]; // gets the file extension
//
//      // instantiate workingDir based on fileType
//      File workingDir = (type.compareTo((String) constants.get("IMAGE")) == 0) ?
//              DIGITAL_MATATUS_IMAGES : // is an image
//              DIGITAL_MATATUS_VIDEOS; // is not IMAGE (thus video)
//
//      // creates a new fileName based on the working timestamp and fileExtension
//      String timestamp = "" + new Date().getTime();
//      String newFileName = timestamp + ext;
//      File newMediaFile = new File(workingDir, newFileName);
//
//      try {
//        boolean created = newMediaFile.createNewFile();
//
//        if (created) {
//          FileOutputStream fileOutputStream = new FileOutputStream(newMediaFile);
//          InputStream inputStream = contentResolver.openInputStream(fileUri);
//          int c = inputStream.read();
//
//          while (c != -1) {
//            // type cast to char
//            fileOutputStream.write(c); // move all the bytes to the newMediaFie
//            // get next char
//            c = inputStream.read();
//          }
//
//          // close the current Streams
//          inputStream.close();
//          fileOutputStream.close();
//
//          // return the file location of the newMediaFileSaved
////          onFinish.invoke(constants.get("WRITE_SUCCESS"), newMediaFile.getAbsolutePath());
//        }
//
//      } catch (Exception e) {
//        // error writing new media file
//        // return "WRITE_ERR" and null
////        onFinish.invoke(constants.get("WRITE_ERR"), null);
//      }
//    } else {
//      String absoluteValue = this.insertQPlus(uri, type);
//    }

  }

  private void insertQPlus(String uri, String type) {
    Uri fileUri = Uri.parse(uri);
    Uri newLocationUri;
    ContentValues contentValues = new ContentValues();
    String name = "" + new Date().getTime();

    if(type.compareTo((String) constants.get("IMAGE")) == 0) {
      contentValues.put(MediaStore.Images.Media.DISPLAY_NAME, name);
      contentValues.put(MediaStore.Images.Media.MIME_TYPE, contentResolver.getType(fileUri));
//      contentValues.put(MediaStore.Images.Media);
    }

  }

  /**
   * This is the method that will be used to read content from uri's across the JSBridge.
   * This is really important esp for files that have the 'content://' uri attached to them
   * as they cannot be read using the java.io.File API as it only deals with the 'file://' URI.
   *
   * @param uri uri of the File that is to be read from in local storage
   * @param onData the callback to be invoked once the data is successfully read.
   *               This function is given:
   *               <ol>
   *                  <li>status (READ_ERR | READ_SUCCESS)</li>
   *                  <li>file data</li>
   *                  <li>file MIME Type</li>
   *               </ol>
   */
  @ReactMethod
  public void readFileContentFromUri(String uri, Callback onData) {
    Uri fileUri = Uri.parse(uri);
    // open stream for data to be read from in bytes
    try {
      InputStream inputStream = contentResolver.openInputStream(fileUri);
      String data = ""; // where file data will be stored
    } catch(Exception e) {
      // declares that an error occurred while reading (i.e FileNotFoundException)
      onData.invoke(constants.get("READ_ERR"));
    }
  }

  /**
   * static method used to write to files
   *
   * @param fileName file to be written to.
   * @param fileData string of data to be written to the file
   */
  static private void writeFile(File fileName, String fileData) {
  }

}