package com.discovmobile.bglocation;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.discovmobile.bglocation.utils.BgLocationPermission;
import com.discovmobile.bglocation.utils.Bglog;
import com.discovmobile.bglocation.utils.Storage;
import com.facebook.react.bridge.Promise;
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
        mContext = reactContext;
        startBackgroundTasks();
    }

    private void startBackgroundTasks(){
        TrackHelper.setMode( mContext, TrackHelper.MODE_PASSIVE );
        Intent intent = new Intent(mContext, LocationTask.class);
        Log.i ("BgLocation", "Trying to init the interval location service.");
        mContext.startService( intent );
    }

    // When the user logs in, we start trying to get the location
    @ReactMethod
    public void startBackgroundLocationUpdates(){
        TrackHelper.setMode( mContext, TrackHelper.MODE_PASSIVE );
    }

    // When the user logs out, we stop trying to get locations
    @ReactMethod
    public void stopBackgroundLocationUpdates() {
        TrackHelper.setMode( mContext, TrackHelper.MODE_OFF );
    }

    // The frontend has searched for discoveries and returned the distance to the
    // closest one. Based on it the bgLocation might switch modes
    @ReactMethod
    public void setDistanceToDiscovery(double distance) {
        Bglog.i("Distance to discovery " + distance );
        LocationManager.onDistanceToDiscovery( mContext, distance );
    }

    // The app is in the foreground and wants frequent location updates
    @ReactMethod
    public void startForegroundTracking() {
        TrackHelper.startForegroundTracking( mContext );
    }

    // The app doesn't need frequent location updates anymore
    @ReactMethod
    public void stopForegroundTracking() {
        TrackHelper.stopForegroundTracking(mContext);
    }

    // The frontend want to know the current location, this will activate the geolocation
    // and fetch one.
    // If the `forced` param is true, the location is always sent back to the frontend,
    // otherwise, the location is only sent if it is different than the previous one
    @ReactMethod
    public void updateLocation( boolean forced ){
        LocationFetcher fetcher = new LocationFetcher( mContext, (BgLocation) -> {

            if( forced ){
                LocationManager.sendLocation(mContext, BgLocation);
            }
            else {
                LocationManager.onLocation(mContext, BgLocation);
            }

            return null;
        });

        fetcher.retrieveLocation();
    }

    @ReactMethod
    public void getBackgroundLocationPermission(Promise promise){
        BgLocationPermission permission = Storage.getBackgroundPermission(mContext);
        if( permission != null ){
            promise.resolve( permission.stringify() );
        }
        else {
            promise.resolve( null );
        }
    }

    @ReactMethod
    public void getDebugMode(Promise promise){
        Boolean debugMode = Storage.getDebugMode(mContext);
        promise.resolve( "{\"isActive\":" + debugMode.toString() + "}" );
    }

    @ReactMethod
    public void setDebugMode( boolean value ){
        Storage.setDebugMode( mContext, value );
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
