package com.discovmobile.bglocation;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofenceStatusCodes;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingEvent;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

public class GeofenceHelper extends BroadcastReceiver {
    private final String FENCE_NAME = "discov_geofence";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("BgLocation", "Geofence event received");
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);

        if (geofencingEvent.hasError()) {
            String errorMessage = GeofenceStatusCodes.getStatusCodeString(geofencingEvent.getErrorCode());
            Log.e("BgLocation", errorMessage);
            return;
        }

        BgLocation location = new BgLocation( geofencingEvent.getTriggeringLocation() );
        geofencingClient = LocationServices.getGeofencingClient(context);
        setFence( context, location );
        LocationHelper.sendLocationToHeadless( context, location, "Geofence" );
    }

    private GeofencingClient geofencingClient;
    protected static boolean fenceSet = false;

    public void start(Context context, BgLocation location) {
        Log.i("BgLocation", "Start geofencing signal received");
        geofencingClient = LocationServices.getGeofencingClient(context);
        setFence(context, location);
    }

    @SuppressLint("MissingPermission")
    public void setFence(Context context, BgLocation location) {
        Geofence fence = new Geofence.Builder()
                // Set the request ID of the geofence. This is a string to identify this
                // geofence.
                .setRequestId(FENCE_NAME)
                .setCircularRegion( location.latitude, location.longitude,50 )
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_EXIT)
                .build();

        GeofenceHelper.fenceSet = true;

        if( LocationHelper.isLocationPermissionGranted( context ) ){
            Log.i("BgLocation", "Setting geofence");
            geofencingClient.addGeofences(getGeofencingRequest(fence), getGeofencePendingIntent(context))
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.i("BgLocation", "Geofence added properly.");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        GeofenceHelper.fenceSet = false;
                        Log.i("BgLocation", "Error adding geofence.");
                        Log.e( "BgLocation", e.getMessage() );
                    }
                });
        }
        else {
            GeofenceHelper.fenceSet = false;
            Log.i("BgLocation", "Permission not granted for geofence");
        }
    }

    public static boolean isFenceSet() { return GeofenceHelper.fenceSet; }

    private GeofencingRequest getGeofencingRequest( Geofence fence ) {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(1);
        builder.addGeofence( fence );
        return builder.build();
    }

    private PendingIntent geofencePendingIntent;
    private PendingIntent getGeofencePendingIntent( Context context ) {
        // Reuse the PendingIntent if we already have it.
        if (geofencePendingIntent != null) {
            return geofencePendingIntent;
        }
        Intent intent = new Intent(context, this.getClass());
        // We use FLAG_UPDATE_CURRENT so that we get the same pending intent back when
        // calling addGeofences() and removeGeofences().
        geofencePendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.
                FLAG_UPDATE_CURRENT);
        return geofencePendingIntent;
    }

    private boolean hasPermissionGranted( Context context ) {
        return ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED;
    }
}
