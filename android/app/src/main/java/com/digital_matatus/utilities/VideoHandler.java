package com.digital_matatus.utilities;

import android.graphics.Bitmap;
import android.media.ThumbnailUtils;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.FileOutputStream;

/**
 * Due to the complex nature of videos, we choose to hava a seperate class that handles the
 * generation of video thumbnails. (Also to reduce the code length of the FileManager)
 */
public class VideoHandler implements  Runnable{

  private final File THUMB_DIRECTORY;
  private final File videoFile;
  String fileName; // file name with the extension removed

  private final ReactApplicationContext reactApplicationContext;

  public VideoHandler(File videoFile, File THUMB_DIRECTORY, ReactApplicationContext reactApplicationContext) {
    this.videoFile = videoFile;
    this.THUMB_DIRECTORY = THUMB_DIRECTORY;
    this.reactApplicationContext = reactApplicationContext;

    fileName = videoFile.getName().split("\\.")[0];
  }

  @Override
  public void run() {
    Bitmap microThumb =  ThumbnailUtils.createVideoThumbnail(THUMB_DIRECTORY.getAbsolutePath(), MediaStore.Images.Thumbnails.MICRO_KIND);
    Bitmap miniThumb =  ThumbnailUtils.createVideoThumbnail(THUMB_DIRECTORY.getAbsolutePath(), MediaStore.Images.Thumbnails.MICRO_KIND);
    Bitmap fullScreenThumb =  ThumbnailUtils.createVideoThumbnail(THUMB_DIRECTORY.getAbsolutePath(), MediaStore.Images.Thumbnails.MICRO_KIND);

    try {
      // creates a JPEG file that will house the Bitmap
      File microThumbnail = new File(THUMB_DIRECTORY, "MICRO_" + fileName + ".jpeg");
      File miniThumbnail = new File(THUMB_DIRECTORY, "MINI_" + fileName + ".jpeg");
      File fullScreenThumbnail = new File(THUMB_DIRECTORY, "FULL_" + fileName + ".jpeg");

      microThumbnail.createNewFile();
      miniThumbnail.createNewFile();
      fullScreenThumbnail.createNewFile();

      FileOutputStream microThumbFOS = new FileOutputStream(microThumbnail);
      FileOutputStream miniThumbFOS = new FileOutputStream(miniThumbnail);
      FileOutputStream fullThumbFOS = new FileOutputStream(fullScreenThumbnail);

      microThumb.compress(Bitmap.CompressFormat.JPEG, 50, microThumbFOS);
      miniThumb.compress(Bitmap.CompressFormat.JPEG, 50, miniThumbFOS);
      fullScreenThumb.compress(Bitmap.CompressFormat.JPEG, 50, fullThumbFOS);

      emitEvent(microThumbnail, miniThumbnail, fullScreenThumbnail);
    } catch (Exception e) {
    }

  }

  private void emitEvent(File micro, File mini, File fullScreen) {

    WritableMap params = Arguments.createMap();
    params.putString("micro", "file://" + micro.getAbsolutePath());
    params.putString("mini", "file://" + mini.getAbsolutePath());
    params.putString("fullScreen", "file://" + fullScreen.getAbsolutePath());

    // emit the File.getName() event to help the unique listener get its unique
    // listener when it's complete moving the data.
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(videoFile.getName() + "_thumbnails", params);
  }

}
