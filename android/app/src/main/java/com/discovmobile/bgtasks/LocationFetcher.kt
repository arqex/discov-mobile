package com.discovmobile.bgtasks

import android.annotation.SuppressLint
import android.content.Context
import com.discovmobile.bgtasks.utils.BgLocation
import com.discovmobile.bgtasks.utils.Bglog
import com.google.android.gms.location.*

class LocationFetcher( val context: Context, val listener : (location: BgLocation) -> Unit){
    private val locationCallback = createLocationRequestCallback()
    private val locationClient = LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun getLastLocation(){
        locationClient
                .lastLocation
                .addOnSuccessListener { location -> listener(BgLocation(location)) }
    }

    @SuppressLint("MissingPermission")
    fun retrieveLocation(){
        val locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0)

        locationClient
                .requestLocationUpdates( locationRequest, locationCallback, null )
    }

    private fun createLocationRequestCallback(): LocationCallback {
        return object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                onLocationReceived(locationResult)
            }
        }
    }

    fun onLocationReceived( locationResult: LocationResult? ){
        if( locationResult == null ){
            return Bglog.w("No location received");
        }
        for( location in locationResult.locations ){
            listener(BgLocation(location));
        }
        locationClient.removeLocationUpdates( locationCallback );
    }
}