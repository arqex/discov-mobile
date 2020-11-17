package com.discovmobile.bglocation;

import android.annotation.SuppressLint;
import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.discovmobile.MainActivity;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import java.util.Date;

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
        retrieveUsingForegroundNotification();
    }

    private void retrieveUsingForegroundNotification() {
        openNotification();
        retrieveLocation(); // when the location is retrieved the notificaiton should be closed
    }

    private void openNotification() {
        createNotificationChannel();
        Notification notification = createNotification();
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
            for (Location location : locationResult.getLocations()) {
                handleLocationCoordinates(createCoordinates(location.getLatitude(), location.getLongitude()));
                mFusedLocationClient.removeLocationUpdates(mLocationCallback);
            }
        }

        closeNotification();
    }

    private void handleLocationCoordinates( LocationCoordinates coordinates ) {
        broadcastLocationReceived( coordinates );
    }

    private void broadcastLocationReceived(LocationCoordinates locationCoordinates) {
        Intent eventIntent = new Intent(IntervalLocationService.LOCATION_EVENT_NAME);
        eventIntent.putExtra(IntervalLocationService.LOCATION_EVENT_DATA_NAME, mGson.toJson(locationCoordinates));
        getApplicationContext().sendBroadcast(eventIntent);

        Intent headlessIntent = new Intent(getApplicationContext(), HeadlessJSLocationService.class );
        Bundle bundle = new Bundle();
        bundle.putString("location", mGson.toJson((locationCoordinates)));
        headlessIntent.putExtras(bundle);
        getApplicationContext().startService((headlessIntent));
    }

    private void closeNotification() {
        stopForeground(true );
    }

    private LocationCoordinates createCoordinates(double latitude, double longitude) {
        return new LocationCoordinates()
                .setLatitude(latitude)
                .setLongitude(longitude)
                .setTimestamp(new Date().getTime());
    }
}