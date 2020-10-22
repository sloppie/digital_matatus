package com.digital_matatus.utilities;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Environment;

import android.provider.MediaStore;
import android.webkit.MimeTypeMap;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

public class FileManager extends ReactContextBaseJavaModule {

  private ReactApplicationContext reactContext;
  private ContentResolver contentResolver;

  // Public shared storage folders
  private final File PICTURES; // Pictures folder in User's Phone
  private final File DIGITAL_MATATUS_FOLDER; // DigitalMatatus folder
  private final File DIGITAL_MATATUS_IMAGES; // images directory
  private final File DIGITAL_MATATUS_VIDEOS; // videos directory

  // cached folders
  private final File CACHE_DIR;
  private final File CACHED_PICTURES;
  private final File CACHED_VIDEOS;
  private final File CACHED_VIDEO_THUMBNAILS;
  private final File CACHED_AUDIOS;

  // File operations consatnts
  private final Map<String, Object> constants = new HashMap<>();

  public FileManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
    contentResolver = reactContext.getContentResolver();

    // initialise folders
    PICTURES = new File(reactContext.getExternalFilesDir(null), "Pictures");
    DIGITAL_MATATUS_FOLDER = new File(PICTURES, "DigitalMatatus");
    DIGITAL_MATATUS_IMAGES = new File(DIGITAL_MATATUS_FOLDER, "images");
    DIGITAL_MATATUS_VIDEOS = new File(DIGITAL_MATATUS_FOLDER, "videos");

    // initialise cache app
    CACHE_DIR = reactContext.getExternalCacheDir();
    CACHED_PICTURES = new File(CACHE_DIR, "images");
    CACHED_VIDEOS = new File(CACHE_DIR, "videos");
    CACHED_VIDEO_THUMBNAILS = new File(CACHED_VIDEOS, "thumbnails");
    CACHED_AUDIOS = new File(CACHE_DIR, "audios");

    // create the Folder because i forgot to create it in the First iteration

    // create DigitalMatatus folders if they doesn't exist
    setUpFolders();
    // constants to be exposed to JS through Bridge
    constants.put("ERR_FINDING_TYPE", "ERR_FINDING_TYPE");
    constants.put("IMAGE", "IMAGE"); // images constant
    constants.put("VIDEO", "VIDEO"); // video constant
    constants.put("AUDIO", "AUDIO"); // audio constant
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
   * This method is used to find the MIME type of the File over the JSBridge, this will be very
   * useful when uploading the media to the server.
   *
   * @param uri this is the uri of the file whose content type is in question
   * @param details <b>Callback</b> invoked after the the function finishes executing
   */
  @ReactMethod
  public void getContentType(String uri, Promise details) {
    Uri fileUri = Uri.parse(uri);

    // send back the MIME type of the file in question
    details.resolve(contentResolver.getType(fileUri));
  }

  /**
   * Use the underlying MimeTypeMap to get a File's Content-Type
   * @param extension extension derived from the file in the JS bridge
   * @return the mime Type got from the MimeTypeMap
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getMimeTypeFromExtension(String extension) {
    MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
    String mimeType = mimeTypeMap.getMimeTypeFromExtension(extension);

    return  mimeType;
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
   * @param type this is the type of Media being saved to the DIGITAL_MATATUS_FOLDER
   *             (makes it easier) to know which dir to access.
   */
  @ReactMethod
  private void copyMediaFile(String uri, String type) {

      // dispatch a thread to reduce the computation cost on the main thread
      WorkerThread workerThread = new WorkerThread(uri, type, reactContext);
      Thread copyThread = new Thread(workerThread);
      copyThread.start();

  }

  private void insertQPlus(String uri, String type) {
    Uri fileUri = Uri.parse(uri);
    Uri newLocationUri;
    ContentValues contentValues = new ContentValues();
    String name = "" + new Date().getTime();

    if(type.compareTo((String) constants.get("IMAGE")) == 0) {
      contentValues.put(MediaStore.Images.Media.DISPLAY_NAME, name);
      contentValues.put(MediaStore.Images.Media.MIME_TYPE, contentResolver.getType(fileUri));
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
  public void readFileContentFromUri(String uri, Promise onData) {
    Uri fileUri = Uri.parse(uri);
    // open stream for data to be read from in bytes
    try {
      InputStream inputStream = contentResolver.openInputStream(fileUri);
      String data = ""; // where file data will be stored
      int c = inputStream.read();

      while(c != -1) {
        data += (char) c;
        c = inputStream.read();
      }

      inputStream.close();

      onData.resolve(data);

    } catch(Exception e) {
    }
  }

  /**
   * This is used over the JS bridge to notify that we want to fetch the file from the remote Uri
   * and serve it to the use. In interest of time (this will try to send the content once ot it is
   * downloaded).
   * SYNCHRONOUS
   *
   * @param mediaUrl this is the link the media will be fetched from.
   * @param mediaName this is the name the file will be saved as
   * @param mediaType this is the type of file ("IMAGE" | "VIDEO" | "AUDIO")
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean fetchMediaFromUrl(String mediaUrl, String mediaName, String mediaType) {
    File workingCacheDir = getWorkingCacheDir(mediaType);
    File saveableFile = new File(workingCacheDir, mediaName);
    boolean fileCreated = false; // used to make sure File is created before initiating transfer.

    // create the savable File
    try {
      saveableFile.createNewFile();
      fileCreated = true;
    } catch(Exception e) {
      fileCreated = false;
    }

    // wrap to prevent error of accessing a file that is not created
    if(fileCreated) {
      URL url; // will house the file remote url

      try {
        url = new URL(mediaUrl); // create the Media URL

        RemoteFetchWorkerThread rFWT;
        if(mediaType.compareTo("VIDEO") != 0)
          rFWT = new RemoteFetchWorkerThread(
              url,
              reactContext,
              saveableFile); // create the underlying thread
        else // this will help create the Thumbnails
          rFWT = new RemoteFetchWorkerThread(
              url,
              reactContext,
              saveableFile,
              CACHED_VIDEO_THUMBNAILS);

        // create the Thread
        Thread rFWTThread = new Thread(rFWT);
        rFWTThread.start(); // start the Thread
      } catch(Exception e) {
      }

    } else {
      RemoteFetchWorkerThread remoteFetchWorkerThread = new RemoteFetchWorkerThread(saveableFile);
      Thread remoteFetchWorkerThreadThread = new Thread(remoteFetchWorkerThread);
      remoteFetchWorkerThreadThread.start();
    }

    // status of File creation to help know whether to add the Listener
    return fileCreated;
  }

  /**
   * This is a helper function to help access the cache directory folders using the type passed in
   *
   * @param type this is the type of media that is to be accessed in the cache directory
   * @return the respective cache dir to be accessed based on the type parameter
   */
  private File getWorkingCacheDir(String type) {
    // var to be returned
    File workingCacheDir;

    if(type.compareTo("IMAGE") == 0)
      workingCacheDir = CACHED_PICTURES;
    else if(type.compareTo("AUDIO") == 0)
      workingCacheDir = CACHED_AUDIOS;
    else
      workingCacheDir = CACHED_VIDEOS;

    return  workingCacheDir;
  }

  /**
   * Used to look for the file whose name is the substring passed in as the first argument.
   *
   * @param fileName this is the file name that is to be looked for (this does not contain the file
   *                 ext)
   * @param type this is the file type (this could be one of three "IMAGE" | "VIDEO | "AUDIO")
   * @return returns a boolean on whether the file exists.
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean isCached(String fileName, String type) {
    boolean exists = false;
    // this will house the directory we are going to search through
    File workingDir = getWorkingCacheDir(type);

    for(File children: workingDir.listFiles()) {
      exists = children.getName().contains(fileName);

      // break when the file is found
      if(exists)
        break;
    }

    return exists;
  }

  /**
   * This is used to get the file:// uri from the App's eternal cache directory. This function
   * looks for the file in the specified type passed in as an argument.
   *
   * @param fileName filename (without the extName) substring that we're looking for
   * @param type this specifies the folder we're supposed to be looking in.
   * @param onFind this is a Promise that will be resolved on the file is found. The fileUri is
   *               passed in as the Promises first argument.
   */
  @ReactMethod
  public void getCachedUri(String fileName, String type, Promise onFind) {
    File workingCacheDir = getWorkingCacheDir(type);
    String fileUri = ""; // will store the File URI
    // boolean to help query whether a mediaFile in the forEach loop below is the File we're
    // looking for.
    boolean found = false;

    for(File mediaFile: workingCacheDir.listFiles()) {
      found = mediaFile.getName().contains(fileName);

      if(found)
        fileUri = "file://" + mediaFile.getAbsolutePath();
    }

    // resolve the pronise with the file's URI
    onFind.resolve(fileUri);
  }

  /**
   * This method is used to fetch the Thumbnails of pre-cached videos and load them across to
   * the JS bridge. While this may have huge drawbacks on storage, it helps save on downloadable
   * media as it prevents redownload of media when it is already cached in the device.
   *
   * @param micro this is the name string of the cached micro thumbnail
   * @param mini this is the name of the mini thumbnail
   * @param full this is the name of the fill screen thumbnail
   * @param onFind this is the promis that is resolved over the bridge to accesss the results in an
   *               async manner
   */
  @ReactMethod
  public void getCachedVideoThumbnails(String micro, String mini, String full, Promise onFind) {
    // this will store all the thumbnails separated '&'
    String thumbnails = "";
    byte numberFound = 0;

    for(File child: CACHED_VIDEO_THUMBNAILS.listFiles()) {
      boolean thumbnailFound = (
          child.getName().contains(micro) ||
              child.getName().contains((mini)) ||
              child.getName().contains(full));

      if(thumbnailFound) {
        if(numberFound < 2)
          thumbnails += "file://" + child.getAbsolutePath() + "&";
        else
          thumbnails += "file://" + child.getAbsolutePath();
      }
    }

    onFind.resolve(thumbnails);
  }

  /**
   * This method is used to make sure that all the directories needed by the app are in place from
   * the get go.
   * Creates the following folders <ul>
   *   <li>/storage/Pictures/DigitalMatatus/images</li>
   *   <li>/storage/Pictures/DigitalMatatus/videos</li>
   *   <li>/storage/Android/com.digital_matatus/cache/images</li>
   *   <li>/storage/Androis/com.digital_matatus/cache/videos</li>
   * </ul>
   *
   * The above folders are very essential to the inner working of the application.
   */
  private void setUpFolders() {
    try {

      // create directories in the /storage/Pictures folder
      if(!DIGITAL_MATATUS_FOLDER.exists()) {
        // booleans are ignored
        DIGITAL_MATATUS_FOLDER.mkdir();
        DIGITAL_MATATUS_IMAGES.mkdir();
        DIGITAL_MATATUS_VIDEOS.mkdir();
      }


      // create folders in the Apps externalCacheDir
      if(!CACHED_PICTURES.exists()) {
        // create all cached media folders
        CACHED_PICTURES.mkdir();
        CACHED_AUDIOS.mkdir();
        CACHED_VIDEOS.mkdir();
        CACHED_VIDEO_THUMBNAILS.mkdir();
      }

    } catch(Exception e) {
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