package com.discovmobile.bgtasks;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class HeadlessJSLocationService extends HeadlessJsTaskService {
    @Override
    public void onHeadlessJsTaskStart(int taskId) {
        super.onHeadlessJsTaskStart(taskId);
        Bglog.i( "Starting headless task");
        if( LocationHelper.needForegroundService( getApplicationContext() ) ){
            LocationHelper.openNotification(this );
        }
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        super.onHeadlessJsTaskFinish(taskId);
        Bglog.i( "Headless task finished");
        if( LocationHelper.needForegroundService( getApplicationContext() ) ){
            LocationHelper.closeNotification(this );
        }
    }

    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                "HeadlessLocationListener",
                Arguments.fromBundle(extras),
                5000, // timeout for the task
                true
            );
        }
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Bglog.i( "Destroying headless service.");
    }
}
