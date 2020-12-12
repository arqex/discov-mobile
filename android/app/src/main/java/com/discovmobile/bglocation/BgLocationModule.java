package com.discovmobile.bglocation;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.discovmobile.bglocation.utils.Bglog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;


public class BgLocationModule extends ReactContextBaseJavaModule implements JSEventSender {
    private static final String MODULE_NAME = "BgLocation";
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";

    private Context mContext;
    private Intent mAlarmTaskServiceIntent;

    BgLocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);

        Log.i ("BgLocation", "Creating bg location module.");

        TrackHelper.setMode( reactContext, TrackHelper.MODE_PASSIVE );

        mContext = reactContext;
        mAlarmTaskServiceIntent = new Intent(mContext, LocationTask.class);
        startBackgroundLocation();
    }

    @ReactMethod
    public void startBackgroundLocation() {
        Log.i ("BgLocation", "Trying to init the interval location service.");
        mContext.startService( mAlarmTaskServiceIntent );
    }

    @ReactMethod
    public void setDistanceToDiscovery(double distance) {
        Bglog.i("Distance to discovery " + distance );
        LocationManager.onDistanceToDiscovery( mContext, distance );
    }

    @ReactMethod
    public void startForegroundTracking() {
        TrackHelper.startForegroundTracking( mContext );
    }

    @ReactMethod
    public void stopForegroundTracking() {
        TrackHelper.stopForegroundTracking(mContext);
    }

    @ReactMethod
    public void stopBackgroundLocation() {
        mContext.stopService(mAlarmTaskServiceIntent);
    }

    @ReactMethod
    public void updateLocation(){
        LocationFetcher fetcher = new LocationFetcher( mContext, (BgLocation) -> {
            LocationManager.onLocation(mContext, BgLocation);
            return null;
        });

        fetcher.retrieveLocation();
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
