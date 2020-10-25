package com.digital_matatus.utilities;

import android.util.Log;
//import android.widget.Toast;

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

    /**
     * In effort to make the react-native app seem faster, the contentView
     * (from the main Application),  is not handed to the ReactRootView until a message is passed
     * across the bridge that the initial component has mounted. This Method is thus made to handle
     * the switching of the contentView to react-native as it is called from across the bridge.
     *
     * It gets a hold of the MainActivity (which implements the interface {@link ContentViewHandler})
     * to call the method {<code>com.digital_matatus.MainActivity.replaceContentView}</code> which
     * handles the contentView replacement.
     *
     * @return a boolean to the JS across the bridge indicating the status of the switch, if the
     * switch was unsuccessful, the switch is then tried again in 500ms
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean switchContentView() {
        ContentViewHandler contentViewHandler =
                (ContentViewHandler) reactContext.getCurrentActivity();
        String message = (contentViewHandler != null) ? "ContentViewHandler is Live"
                : "ContentViewHandler is null";
        Log.d(reactContext.getPackageName() + ".RenderSynchronizer", message);
        boolean status = true;

        try {
            assert contentViewHandler != null;
            contentViewHandler.replaceContentView();

//            Toast.makeText(reactContext, "setView ran", Toast.LENGTH_SHORT).show();
            status = false;
        } catch (Exception e) {
            Log.d(reactContext.getPackageName() +
                    ".RenderSynchronizer", e.getMessage());
//            Toast.makeText( reactContext, "Unable to setView", Toast.LENGTH_SHORT).show();
            status = true;
        }

        return status;
    }
}
