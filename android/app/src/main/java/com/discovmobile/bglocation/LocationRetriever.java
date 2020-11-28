package com.discovmobile.bglocation;

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

public class LocationRetriever {
    private BgLocationListener mListener;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback;

    public LocationRetriever( BgLocationListener listener ){
        mListener = listener;
    }

    @SuppressLint("MissingPermission")
    protected void retrieveLocation( Context context ) {
        Log.i ("BgLocation", "Getting location.");

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
            Log.i ("BgLocation", "Location received.");
            for (Location location : locationResult.getLocations()) {
                mListener.onLocation( new BgLocation(location) );
                mFusedLocationClient.removeLocationUpdates(mLocationCallback);
            }
        }
        else {
            Log.w ("BgLocation", "No location received.");
        }
    }
}
