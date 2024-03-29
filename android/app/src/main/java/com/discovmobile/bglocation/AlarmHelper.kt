package com.discovmobile.bglocation

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.os.Build
import android.os.SystemClock
import com.discovmobile.bglocation.utils.BgLocationPermission
import com.discovmobile.bglocation.utils.Bglog
import com.discovmobile.bglocation.utils.Storage
import java.util.*


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

        // Update location
        if( needTracking(context) && context != null ){
            updateLocation(context);
        }

        updateBackgroundPermission( context );

        // Maybe create notifications?
        NotificationHelper.checkCreateNotifications(context)

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

        Bglog.i("Getting location ${type}");
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

    private fun updateBackgroundPermission( context: Context? ): BgLocationPermission?{
        if( context == null ) return null;

        val storedPermission = Storage.getBackgroundPermission(context)
        val isGranted = LocationHelper.hasBackgroundPermission(context)
        var permission: BgLocationPermission
        if( storedPermission == null || storedPermission.isGranted != isGranted ){
            permission = BgLocationPermission( isGranted, Date().time, Date().time )
            if( isGranted ){
                LocationStarter.startGeofence(context)
            }
        }
        else {
            permission = BgLocationPermission( isGranted, storedPermission.updatedAt, Date().time )
        }
        Storage.saveBackgroundPermission(context, permission)
        return permission
    }
}
