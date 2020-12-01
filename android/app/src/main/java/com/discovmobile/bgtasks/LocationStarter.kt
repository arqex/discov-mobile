package com.discovmobile.bgtasks

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.discovmobile.bgtasks.utils.Bglog

class LocationStarter: BroadcastReceiver() {
    companion object {
        @JvmStatic
        fun startAll( context: Context?, skipGeofence: Boolean = false ){
            if( context == null ) return;

            // Starting any service will replace the previous one (if any)
            // but the worker, that keeps the previous worker running
            startAlarm( context );
            startActivityTransitions( context )
            startWorker( context )
            if( !skipGeofence ){
                startGeofence( context )
            }
        }

        @JvmStatic
        fun startAlarm( context: Context ){
            AlarmHelper.start( context );
        }

        @JvmStatic
        fun startActivityTransitions( context: Context ){
            MovementHelper.start( context )
        }

        @JvmStatic
        fun startWorker( context: Context ){
            WorkerHelper.start(context)
        }

        @JvmStatic
        fun startGeofence( context: Context ){
            LocationFetcher( context, fun(location) {
                GeofenceHelper.start( context, location )
            }).retrieveLocation()
        }
    }


    override fun onReceive(context: Context?, intent: Intent?) {
        Bglog.i("Start intent received")
        HeadlessService.sendSignal(context, "boot")
        startAll( context )
    }
}