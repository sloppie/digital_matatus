package com.digital_matatus.utilities;

/**
 *
 * This Interface is used to handle the switching of the ContentView in activities interfacing with
 * React without exposing the ReactRootView to those classes. In the case that you eant to allow
 * to the setContentView method contained in the Activity class, implement this method in your activity
 * and use use this Interface to get access to the replaceContentView method from anywhere you can
 * access the ApplicationContext.
 */
public interface ContentViewHandler {
    /*
     * this method will be implemented by the ReactActivity to allow
     * dynamic replacement of contentViews once the JSModule finishes
     * rendering the main component.
     */
    void replaceContentView();
}
