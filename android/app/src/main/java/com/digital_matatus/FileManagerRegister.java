package com.digital_matatus;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import com.digital_matatus.utilities.FileManager;

public class FileManagerRegister implements ReactPackage {

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(
    ReactApplicationContext reactContext
  ) {
    List<NativeModule> modules = new ArrayList<>();

    modules.add(new FileManager(reactContext));

    return modules;
  }
  
}