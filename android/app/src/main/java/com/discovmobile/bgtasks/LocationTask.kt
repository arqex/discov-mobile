package com.discovmobile.bgtasks

import android.app.Service
import android.content.Intent
import android.os.IBinder

class LocationTask: Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Bglog.i("Starting location service")
        AlarmHelper.start( applicationContext )
        ActivityTransitionHelper.start( applicationContext )
        WorkerHelper.start( applicationContext )
        startGeofence()
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onDestroy() {
        super.onDestroy()
        Bglog.i( "Destroying location service. Retry to load the worker.")
        WorkerHelper.start( applicationContext )
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null;
    }

    fun startGeofence() {
        LocationFetcher( applicationContext, fun(location) {
            GeofenceHelper.start( applicationContext, location )
        }).retrieveLocation()
    }
}