package com.discovmobile.bgtasks;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

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

        retriever.getLastLocation( getApplicationContext() );
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

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
