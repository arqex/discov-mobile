package com.discovmobile.bglocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.discovmobile.bgtasks.BgTask;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static com.discovmobile.bglocation.IntervalLocationService.LOCATION_EVENT_DATA_NAME;

public class BgLocationModule extends ReactContextBaseJavaModule implements LocationEventReceiver, JSEventSender {
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
        mAlarmTaskServiceIntent = new Intent(mContext, BgTask.class);
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

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(CONST_JS_LOCATION_EVENT_NAME, IntervalLocationService.JS_LOCATION_EVENT_NAME);
        constants.put(CONST_JS_LOCATION_LAT, IntervalLocationService.JS_LOCATION_LAT_KEY);
        constants.put(CONST_JS_LOCATION_LON, IntervalLocationService.JS_LOCATION_LON_KEY);
        constants.put(CONST_JS_LOCATION_TIME, IntervalLocationService.JS_LOCATION_TIME_KEY);
        return constants;
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                LocationCoordinates locationCoordinates = mGson.fromJson(
                        intent.getStringExtra(LOCATION_EVENT_DATA_NAME), LocationCoordinates.class);
                WritableMap eventData = Arguments.createMap();
                eventData.putDouble(
                        IntervalLocationService.JS_LOCATION_LAT_KEY,
                        locationCoordinates.getLatitude());
                eventData.putDouble(
                        IntervalLocationService.JS_LOCATION_LON_KEY,
                        locationCoordinates.getLongitude());
                eventData.putDouble(
                        IntervalLocationService.JS_LOCATION_TIME_KEY,
                        locationCoordinates.getTimestamp());
                // if you actually want to send events to JS side, it needs to be in the "Module"
                sendEventToJS(getReactApplicationContext(),
                        IntervalLocationService.JS_LOCATION_EVENT_NAME, eventData);
            }
        };
    }

    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(IntervalLocationService.LOCATION_EVENT_NAME);
        mContext.registerReceiver(mEventReceiver, eventFilter);
    }

    @Override
    public void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
