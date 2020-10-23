package com.digital_matatus.utilities;

public interface ContentViewHandler {
    // this method will be implemented by the ReactActivity to allow
    // dynamic replacement of contentViews once the JSModule finishes
    // rendering the main component.
    void replaceContentView();
}
