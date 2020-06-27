package com.digital_matatus.utilities;

import android.net.Uri;
import android.content.ContentResolver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class RemoteFetchWorkerThread implements Runnable {

  // remote Uri to fetch from
  private final URL remoteUri;
  private final ReactApplicationContext reactApplicationContext;
  // this will be used to resolve the content from the remote API
  private final File saveableFile;
  private final ContentResolver contentResolver;

  private File THUMB_DIRECTORY = null; // not null when it is a video file

  /**
   * This is the Runnable class that will be used to fetch the file from the remote URI and store
   * the port the InputStream into the App's to the saveable File's FileOutputStream.
   *
   * @param remoteUri the Uri to fetch the data from.
   * @param reactApplicationContext App's current Context
   * @param saveableFile file that the input stream will be saved to
   */
  public RemoteFetchWorkerThread(
      URL remoteUri,
      ReactApplicationContext reactApplicationContext,
      File saveableFile
  ) {
    this.remoteUri = remoteUri;
    this.reactApplicationContext = reactApplicationContext;
    this.contentResolver = reactApplicationContext.getContentResolver();
    this.saveableFile = saveableFile;
  }

  public RemoteFetchWorkerThread(
      URL remoteUri,
      ReactApplicationContext reactApplicationContext,
      File saveableFile,
      File THUMB_DIRECTORY
  ) {
    this.remoteUri = remoteUri;
    this.reactApplicationContext = reactApplicationContext;
    this.contentResolver = reactApplicationContext.getContentResolver();
    this.saveableFile = saveableFile;
    this.THUMB_DIRECTORY = THUMB_DIRECTORY;
  }

  public RemoteFetchWorkerThread(File saveableFile) {
    this.remoteUri = null;
    this.reactApplicationContext = null;
    this.contentResolver = null;
    this.saveableFile = saveableFile;
  }

  @Override
  public void run() {

    if(this.remoteUri == null) // file is already created
      this.emitEvent();
    else {
      try {
        HttpURLConnection httpURLConnection = (HttpURLConnection) remoteUri.openConnection();
        httpURLConnection.connect();
        InputStream inputStream = httpURLConnection.getInputStream();
        FileOutputStream fileOutputStream = new FileOutputStream(saveableFile);

        int data = inputStream.read();

        while(data != -1) {
          fileOutputStream.write(data);

          data = inputStream.read();
        }

        inputStream.close();
        fileOutputStream.flush();
        fileOutputStream.close();
        httpURLConnection.disconnect();

        this.emitEvent();

        // this block is only for the creation of thumbnails in the event that this is a video
        // file that is being saved to cache.
        if(THUMB_DIRECTORY != null) {
          VideoHandler videoHandler = new VideoHandler(saveableFile, THUMB_DIRECTORY, reactApplicationContext);
          Thread videoHandlerThread = new Thread(videoHandler);
          videoHandlerThread.start();
        }

      } catch(Exception e) {
      }
    }


  }

  private void emitEvent() {
    String cacheUri = "file://" + saveableFile.getAbsolutePath();

    WritableMap params = Arguments.createMap();
    params.putString("uri", cacheUri);

    // emit the File.getName() event to help the unique listener get its unique
    // listener when it's complete moving the data.
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(saveableFile.getName(), params);
  }

}
