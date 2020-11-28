package com.discovmobile.bgtasks;

import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Location;
import android.os.Handler;
import android.util.Log;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

public class LocationRetriever {
    private BgLocationListener mListener;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback;

    public LocationRetriever(BgLocationListener listener ){
        mListener = listener;
    }

    @SuppressLint("MissingPermission")
    protected void getLastLocation( Context context ) {
        FusedLocationProviderClient client = LocationServices.getFusedLocationProviderClient( context );
        client.getLastLocation()
                .addOnSuccessListener(new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        mListener.onLocation( new BgLocation(location) );
                    }
                });
    }

    @SuppressLint("MissingPermission")
    protected void retrieveLocation( Context context ) {
        Bglog.i( "Getting location.");

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient( context );
        mLocationCallback = createLocationRequestCallback();

        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0);

        new Handler(context.getMainLooper()).post(() -> mFusedLocationClient.requestLocationUpdates(locationRequest, createLocationRequestCallback(), null));
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
                Bglog.i( "Location received " + location.getTime() );
                mListener.onLocation( new BgLocation(location) );
            }
            mFusedLocationClient.removeLocationUpdates(mLocationCallback);
        }
        else {
            Bglog.w("No location received.");
        }
    }
}
