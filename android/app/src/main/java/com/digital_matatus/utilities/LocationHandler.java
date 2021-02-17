package com.digital_matatus.utilities;

import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LocationHandler extends ReactContextBaseJavaModule {
    public final ReactContext context;
    private Callback onErr = null;
    private Callback onTurnOn = null;

    public String getName() {
        return "LocationHandler";
    }

    public LocationHandler(ReactApplicationContext reactApplicationContext) {
        this.context = reactApplicationContext;
    }

    @ReactMethod
    public void turnOnLocationServices() {
        this.onErr = onErr;
        this.onTurnOn = onTurnOn;
        Intent turnOnLocationIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        context.getCurrentActivity().startActivity(turnOnLocationIntent);
    }
}
