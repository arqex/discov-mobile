package com.discovmobile.bglocation

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.hardware.display.DisplayManager
import android.net.ConnectivityManager
import android.os.Build
import android.os.PowerManager
import android.os.SystemClock
import android.view.Display
import com.discovmobile.bglocation.utils.Bglog


class AlarmHelper: BroadcastReceiver() {
    companion object {
        final val ALARM_ID = 0
        final val POLL_INTERVAL = 60000

        @JvmStatic
        fun start(context: Context?){
            Bglog.i("Setting alarm")

            // Create intent
            val i = Intent(context, AlarmHelper::class.java)
            val pendingIntent = PendingIntent.getBroadcast(context, ALARM_ID, i, PendingIntent.FLAG_UPDATE_CURRENT)

            // Alarm manager
            val manager = context?.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            // Set alarm
            manager.set(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    SystemClock.elapsedRealtime() + POLL_INTERVAL,
                    pendingIntent
            )
        }
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Bglog.i("Alarm broadcast received")

        // Send a sign
        HeadlessService.sendSignal(context, "alarm")

        // Get a location

        if( needTracking(context) && context != null ){
            updateLocation(context);
        }

        // Restart alarm
        start(context)
    }

    fun updateLocation(context: Context){
        var type = "coarse";
        val fetcher = LocationFetcher(context, fun(location) {
            location.source = "alarm:$type"
            LocationManager.onLocation(context, location)
        });

        if (LocationManager.needFineLocation(context)) {
            type = "fine";
            fetcher.retrieveLocation()
        } else {
            fetcher.getLastLocation()
        }
    }

    private fun isNetworkAvailable(context: Context?): Boolean {
        val connectivityManager = context?.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager?
        val activeNetworkInfo = connectivityManager?.activeNetworkInfo
        return activeNetworkInfo != null && activeNetworkInfo.isConnected
    }

    private fun needTracking(context: Context?): Boolean{
        if( context == null ) {
            Bglog.i("No tracking: no context")
            return false
        };

        val trackingMode = TrackHelper.getMode(context);
        if( trackingMode != TrackHelper.MODE_PASSIVE ){
            Bglog.i("No tracking: Tracking mode $trackingMode")
            return false
        };

        return true;
    }
}