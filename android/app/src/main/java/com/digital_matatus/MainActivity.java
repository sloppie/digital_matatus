package com.digital_matatus;

import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import androidx.appcompat.app.AppCompatActivity;

import com.digital_matatus.utilities.ContentViewHandler;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

public class MainActivity extends AppCompatActivity
        implements DefaultHardwareBackBtnHandler, ContentViewHandler {

  protected ReactRootView mReactRootView;
  protected ReactInstanceManager mReactInstanceManager;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
//  @Override
//  protected String getMainComponentName() {
//    return "digital_matatus";
//  }

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

//    setContentView(mReactRootView);
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

    Log.d(getPackageName() + ".RenderSynchronizer", "Render is waay live");
//    recreate();
  }
}
