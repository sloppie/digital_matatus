package com.digital_matatus.utilities;

import android.content.ContentResolver;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Date;

public class WorkerThread implements Runnable {

    private final ReactApplicationContext reactContext;

    private String uri;
    private String type;
    private Uri fileUri;

    private final File PICTURES; // Pictures folder in User's Phone
    private final File DIGITAL_MATATUS_FOLDER; // DigitalMatatus folder
    private final File DIGITAL_MATATUS_IMAGES; // images directory
    private final File DIGITAL_MATATUS_VIDEOS; // videos directory

    private ContentResolver contentResolver;

    public WorkerThread(String uri, String type, ReactApplicationContext reactContext) {
        this.uri =  uri;
        this.type = type;
        fileUri = Uri.parse(uri);

        this.reactContext = reactContext;
        contentResolver = reactContext.getContentResolver();

        // initialise folders
        PICTURES = new File(reactContext.getExternalFilesDir(null), "Pictures");
        DIGITAL_MATATUS_FOLDER = new File(PICTURES, "DigitalMatatus");
        DIGITAL_MATATUS_IMAGES = new File(DIGITAL_MATATUS_FOLDER, "images");
        DIGITAL_MATATUS_VIDEOS = new File(DIGITAL_MATATUS_FOLDER, "videos");
    }

    @Override
    public void run() {
        Uri fileUri = Uri.parse(uri);
        String[] segments = uri.split("/");
        String ext = segments[(segments.length - 1)];
        // get the fileName and the fileExtension
        String fileName = new File(
                uri.split("file://")[1] // file absolute location
        ).getName(); // get the fileName

        // instantiate workingDir based on fileType
        File workingDir = (type.compareTo("IMAGE") == 0) ?
                DIGITAL_MATATUS_IMAGES : // is an image
                DIGITAL_MATATUS_VIDEOS; // is not IMAGE (thus video)

        // creates a new fileName based on the working timestamp and fileExtension
        String timestamp = "" + new Date().getTime();
        String newFileName = timestamp + ext;
        File newMediaFile = new File(workingDir, newFileName);

        try {
            boolean created = newMediaFile.createNewFile();

            if (created) {
                FileOutputStream fileOutputStream = new FileOutputStream(newMediaFile);
                InputStream inputStream = contentResolver.openInputStream(fileUri);
                int c = inputStream.read();

                while (c != -1) {
                    // type cast to char
                    fileOutputStream.write(c); // move all the bytes to the newMediaFie
                    // get next char
                    c = inputStream.read();
                }

                // close the current Streams
                inputStream.close();
                fileOutputStream.close();
            }

        } catch (Exception e) {
            Log.d("com.digital_matatus.RFT", e.toString());
        }
    }

}
