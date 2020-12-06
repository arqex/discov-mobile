package com.discovmobile.bglocation

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.discovmobile.bglocation.utils.BgLocation
import com.discovmobile.bglocation.utils.Bglog
import com.google.android.gms.location.*
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener

class GeofenceHelper: BroadcastReceiver() {
    companion object {
        @JvmStatic
        fun start( context: Context, location: BgLocation){
            Bglog.i("Start geofencing signal received")
            val client = LocationServices.getGeofencingClient(context)
            setFence(context, client, location)
        }
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Bglog.i("Geofence event received")
        val geofencingEvent = GeofencingEvent.fromIntent(intent)
        if (geofencingEvent.hasError()) {
            Bglog.e(GeofenceStatusCodes.getStatusCodeString(geofencingEvent.errorCode))
            return
        }

        val location = BgLocation(geofencingEvent.triggeringLocation)
        val client = LocationServices.getGeofencingClient(context!!)
        setFence(context, client, location)
        HeadlessService.sendSignal(context, "geofence")
        HeadlessService.sendLocation(context, location, "Geofence")

        // Restart background tasks, but the geofence
        LocationStarter.startAll(context, true);
        // Report moving
        MovementHelper.reportMoving(context)
    }
}

private val FENCE_NAME = "discov_geofence"

@SuppressLint("MissingPermission")
private fun setFence(context: Context?, client: GeofencingClient, location: BgLocation){
    val fence = Geofence.Builder()
            // Set the request ID of the geofence. This is a string to identify this
            // geofence.
            .setRequestId(FENCE_NAME)
            .setCircularRegion(location.latitude, location.longitude, 100f)
            .setExpirationDuration(Geofence.NEVER_EXPIRE)
            .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_EXIT)
            .build()

    if (LocationHelper.isLocationPermissionGranted(context)) {
        Bglog.i("Setting geofence")
        client.addGeofences(getRequest(fence), getPendingIntent(context))
                .addOnSuccessListener(OnSuccessListener<Void?> { Bglog.i("Geofence added properly.") })
                .addOnFailureListener(OnFailureListener { e ->
                    Bglog.i("Error adding geofence.")
                    Bglog.e(e.message)
                })
    } else {
        Bglog.i("Permission not granted for geofence")
    }
}

private fun getRequest(fence: Geofence): GeofencingRequest{
    return GeofencingRequest.Builder()
            .setInitialTrigger(1)
            .addGeofence(fence)
            .build()
}

private fun getPendingIntent(context: Context?): PendingIntent{
    val intent = Intent(context, GeofenceHelper::class.java)
    return PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
}