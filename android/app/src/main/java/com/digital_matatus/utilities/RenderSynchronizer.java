package com.digital_matatus.utilities;

import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RenderSynchronizer extends ReactContextBaseJavaModule {

    private final ReactContext reactContext;

    public RenderSynchronizer(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RenderSynchronizer";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean switchContentView() {
        ContentViewHandler contentViewHandler = (ContentViewHandler) reactContext.getCurrentActivity();
        String message = (contentViewHandler != null) ? "ContentViewHandler is Live"
                : "ContentViewHandler is null";
        Log.d(reactContext.getPackageName() + ".RenderSynchronizer", message);
        boolean status = true;

        try {
            assert contentViewHandler != null;
            contentViewHandler.replaceContentView();

            Toast.makeText(reactContext, "setView ran", Toast.LENGTH_SHORT).show();
            status = false;
        } catch (Exception e) {
            Log.d(reactContext.getPackageName() + ".RenderSynchronizer", e.getMessage());
            Toast.makeText( reactContext, "Unable to setView", Toast.LENGTH_SHORT).show();
            status = true;
        }

        return status;
    }
}
