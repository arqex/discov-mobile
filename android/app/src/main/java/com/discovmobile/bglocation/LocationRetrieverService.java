package com.discovmobile.bglocation;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.discovmobile.MainActivity;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
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
        if( isPermissionGranted() ){
            Log.i ("BgLocation", "Permission granted, getting location.");
            retrieveUsingForegroundNotification();
        }
        else {
            Log.i ("BgLocation", "Permission not granted to get the background location.");
        }
    }

    protected boolean isPermissionGranted(){
        return ContextCompat.checkSelfPermission( getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION ) == PackageManager.PERMISSION_GRANTED;
    }

    private void retrieveUsingForegroundNotification() {
        openNotification();
        retrieveLocation(); // when the location is retrieved the notificaiton should be closed
    }

    private void openNotification() {
        createNotificationChannel();
        Notification notification = createNotification();
        Log.i ("BgLocation", "Starting notification.");
        startForeground(NOTIFICATION_ID, notification);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .build();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("MissingPermission")
    protected void retrieveLocation() {
        Log.i ("BgLocation", "Getting location.");
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
        mLocationCallback = createLocationRequestCallback();

        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0);

        new Handler(getMainLooper()).post(() -> mFusedLocationClient.requestLocationUpdates(locationRequest, mLocationCallback, null));
    }

    private LocationCallback createLocationRequestCallback() {
        return new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                onLocationReceived(locationResult);
            }
        };
    }

    private void onLocationReceived( LocationResult locationResult ){
        if (locationResult != null) {
            Log.i ("BgLocation", "Location received.");
            for (Location location : locationResult.getLocations()) {
                handleLocation( new BgLocation(location) );
                mFusedLocationClient.removeLocationUpdates(mLocationCallback);
            }
        }
        else {
            Log.w ("BgLocation", "No location received.");
        }

        closeNotification();
    }

    private void handleLocation(BgLocation location ) {
        broadcastLocationReceived( location );
    }

    private void broadcastLocationReceived(BgLocation location) {
        Log.i ("BgLocation", "Sending location to headless.");
        Intent headlessIntent = new Intent(getApplicationContext(), HeadlessJSLocationService.class );
        Bundle bundle = new Bundle();
        bundle.putString("location", mGson.toJson( location ));
        headlessIntent.putExtras(bundle);
        getApplicationContext().startService((headlessIntent));
    }

    private void closeNotification() {
        Log.i ("BgLocation", "Closing notification.");
        stopForeground(true );
    }

    @Override
    public void onDestroy() {
        Log.i ("BgLocation", "Destroying location retriever service.");
    }
}