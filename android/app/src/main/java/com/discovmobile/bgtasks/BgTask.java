package com.discovmobile.bgtasks;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;

public class BgTask extends Service {

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startAlarm();
        startGeofence();
        startWorker();
        listenToActivity();
        return super.onStartCommand(intent, flags, startId);
    }

    private void startAlarm() {
        Bglog.i("Starting alarm task");
        LocationAlarm.start( getApplicationContext() );
    }

    private void startGeofence() {
        LocationRetriever retriever = new LocationRetriever(new BgLocationListener() {
            @Override
            void onLocation(BgLocation location) {
                setGeofence( location );
            }
        });

        retriever.retrieveLocation( getApplicationContext() );
    }

    private void listenToActivity() {
        ActivityTransitionHelper activityHelper = new ActivityTransitionHelper();
        activityHelper.setListener( getApplicationContext() );
    }

    private void startWorker() {
        LocationWorker.enqueueWork( getApplicationContext() );
    }

    private GeofenceHelper geofence;
    private void setGeofence( BgLocation location ){
        if( GeofenceHelper.isFenceSet() ) {
            Bglog.i( "Geofence already set");
            return;
        }

        Bglog.i( "Starting geofence");
        geofence = new GeofenceHelper();
        geofence.start( getApplicationContext(), location );
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Bglog.i("Destroying backround task. Restarting the worker.");
        super.onDestroy();
        startWorker();
    }
}
