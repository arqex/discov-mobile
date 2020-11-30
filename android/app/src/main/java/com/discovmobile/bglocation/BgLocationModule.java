package com.discovmobile.bglocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.discovmobile.bgtasks.LocationTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;


public class BgLocationModule extends ReactContextBaseJavaModule implements JSEventSender {
    private static final String MODULE_NAME = "BgLocation";
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";

    private Context mContext;
    // private Intent mIntervalLocationServiceIntent;
    private Intent mAlarmTaskServiceIntent;
    private BroadcastReceiver mEventReceiver;
    private Gson mGson;

    BgLocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        Log.i ("BgLocation", "Creating bg location module.");

        mContext = reactContext;
        //mIntervalLocationServiceIntent = new Intent(mContext, IntervalLocationService.class);mAlarmTaskServiceIntent;
        mAlarmTaskServiceIntent = new Intent(mContext, LocationTask.class);
        mGson = new Gson();
        // createEventReceiver();
        // registerEventReceiver();
        startBackgroundLocation();
    }

    @ReactMethod
    public void startBackgroundLocation() {
        Log.i ("BgLocation", "Trying to init the interval location service.");
        mContext.startService( mAlarmTaskServiceIntent );
    }

    @ReactMethod
    public void stopBackgroundLocation() {
        mContext.stopService(mAlarmTaskServiceIntent);
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
