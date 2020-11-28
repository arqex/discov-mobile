package com.discovmobile.bglocation;

import android.annotation.SuppressLint;
import android.app.IntentService;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.gson.Gson;

public class LocationRetrieverService extends IntentService {
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    public static final int NOTIFICATION_ID = 1;

    private BroadcastReceiver mEventReceiver;
    private Gson mGson;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback;

    public LocationRetrieverService() {
        super(IntervalLocationService.class.getName());
        mGson = new Gson();
    }

    protected void onHandleIntent(@Nullable Intent intent) {
        if( LocationHelper.isLocationPermissionGranted( getApplicationContext() ) ){
            Log.i ("BgLocation", "Permission granted, getting location.");
            if( LocationHelper.isAppOnForeground( getApplicationContext() ) ){
                retrieveLocation( false );
            }
            else {
                retrieveUsingForegroundNotification();
            }
        }
        else {
            Log.i ("BgLocation", "Permission not granted to get the background location.");
        }
    }

    private void retrieveUsingForegroundNotification() {
        LocationHelper.openNotification( this );
        retrieveLocation( true ); // when the location is retrieved the notificaiton should be closed
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("MissingPermission")
    protected void retrieveLocation( boolean isForeground ) {
        LocationRetriever retriever = new LocationRetriever( new BgLocationListener() {
            @Override
            void onLocation(BgLocation location) {
                handleLocation( location );
                if( isForeground ){
                    closeNotification();
                }
            }
        });

        Log.i ("BgLocation", "Getting location.");
        retriever.retrieveLocation( getApplicationContext() );
        restartAlarm();
    }

    private void handleLocation(BgLocation location ) {
        setGeofence( location );
        LocationHelper.sendLocationToHeadless( getApplicationContext(), location, "Retriever" );
    }

    private void closeNotification() {
        Log.i ("BgLocation", "Closing notification.");
        stopForeground(true );
    }

    private GeofenceHelper geofence;
    private void setGeofence( BgLocation location ){
        if( GeofenceHelper.isFenceSet() ) {
            Log.i("BgLocation", "Geofence already set");
            return;
        }

        Log.i("BgLocation", "Starting geofence");
        geofence = new GeofenceHelper();
        geofence.start( getApplicationContext(), location );
    }

    private void restartAlarm() {
        AlarmStarter starter = new AlarmStarter();
        starter.start( getApplicationContext() );
    }

    @Override
    public void onDestroy() {
        Log.i ("BgLocation", "Destroying location retriever service.");
    }
}