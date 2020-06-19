package com.digital_matatus.utilities;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FileManager extends ReactContextBaseJavaModule {

  ReactApplicationContext reactContext;

  FileManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  @Override
  String getName() {

    return "FileManager";
  }

}