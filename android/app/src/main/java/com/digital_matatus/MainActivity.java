package com.digital_matatus;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.digital_matatus.utilities.ContentViewHandler;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

public class MainActivity extends AppCompatActivity
        implements DefaultHardwareBackBtnHandler, PermissionAwareActivity, ContentViewHandler {

  protected ReactRootView mReactRootView;
  protected ReactInstanceManager mReactInstanceManager;
  protected  PermissionListener permissionListener;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_splash_screen);
    mReactInstanceManager = ((ReactApplication)getApplication())
            .getReactNativeHost()
            .getReactInstanceManager();

    mReactRootView = new ReactRootView(this);

    mReactRootView.startReactApplication(
            mReactInstanceManager,
            "digital_matatus",
            null);

  }

  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }

  @Override
  protected void onPause() {
    super.onPause();

    if(mReactInstanceManager != null)
      mReactInstanceManager.onHostPause(this);
  }

  @Override
  protected void onResume() {
    super.onResume();

    if(mReactInstanceManager != null)
      mReactInstanceManager.onHostResume(this, this);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();

    if (mReactInstanceManager != null) {
      mReactInstanceManager.onHostDestroy(this);
    }

    if (mReactRootView != null) {
      mReactRootView.unmountReactApplication();
    }
  }

  @Override
  public void onBackPressed() {

    if (mReactInstanceManager != null) {
      mReactInstanceManager.onBackPressed();
    } else {
      super.onBackPressed();
    }
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {

    if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
      mReactInstanceManager.showDevOptionsDialog();
      return true;
    }
    return super.onKeyUp(keyCode, event);
  }

  @Override
  public void replaceContentView() {

    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        setContentView(mReactRootView);
      }
    });

  }

  @RequiresApi(api = Build.VERSION_CODES.M)
  @Override
  public void requestPermissions(
          String[] permissions, int requestCode, PermissionListener listener) {
    super.requestPermissions(permissions, requestCode);
    permissionListener = listener;
  }

  @Override
  public void onRequestPermissionsResult(
          int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    permissionListener = null;
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
    }
  }
}
