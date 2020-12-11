package com.discovmobile.bglocation

import android.annotation.SuppressLint
import android.content.Context
import com.discovmobile.bglocation.utils.BgLocation
import com.discovmobile.bglocation.utils.Bglog
import com.google.android.gms.location.*
import java.time.format.DecimalStyle

class LocationFetcher( val context: Context, val listener : (location: BgLocation) -> Unit){
    private var locationCallback = createLocationRequestCallback( false )
    private val locationClient = LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun getLastLocation(){
        locationClient
                .lastLocation
                .addOnSuccessListener { location -> listener(BgLocation(location, "lastLocation")) }
    }

    @SuppressLint("MissingPermission")
    fun retrieveLocation(){
        locationCallback = createLocationRequestCallback( false )
        val locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0)

        locationClient
                .requestLocationUpdates( locationRequest, locationCallback, null )
    }

    @SuppressLint("MissingPermission")
    fun listenToLocations(){
        locationCallback = createLocationRequestCallback( true )
        val locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(20000)
                .setFastestInterval(0)

        locationClient
                .requestLocationUpdates( locationRequest, locationCallback, null )
    }

    fun stopListening() {
        locationClient.removeLocationUpdates( locationCallback );
    }

    private fun createLocationRequestCallback( sticky: Boolean): LocationCallback {
        return object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                onLocationReceived(locationResult, sticky)
            }
        }
    }

    fun onLocationReceived( locationResult: LocationResult?, sticky: Boolean ){
        if( locationResult == null ){
            return Bglog.w("No location received");
        }
        for( location in locationResult.locations ){
            listener(BgLocation(location, "fetcher"));
        }
        if( !sticky ){
            locationClient.removeLocationUpdates( locationCallback );
        }
    }
}