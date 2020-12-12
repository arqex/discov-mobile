package com.discovmobile;

import android.content.Intent;
import android.os.Bundle;

import com.discovmobile.bglocation.utils.Bglog;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bglog.i("$$$ Main activity started");
        checkNotificationTap();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Bglog.i("$$$ Main activity resumed");
        checkNotificationTap();
    }

    private void checkNotificationTap(){
        Intent intent = getIntent();
        if( intent != null ){
            String source = intent.getStringExtra("source");
            if( source == "locationNotification" ){
                Bglog.i("Starting from notification tap");
                return;
            }
        }

        Bglog.i("NOT starting from notification tap");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "discovmobile";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
