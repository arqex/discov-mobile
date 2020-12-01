package com.discovmobile.bgtasks

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.SystemClock
import com.discovmobile.bgtasks.utils.Bglog

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
        if( context !== null ){
            updateLocation(context)
        }
        // Restart alarm
        start(context)
    }

    fun updateLocation(context: Context){
        val fetcher = LocationFetcher( context, fun (location) {
            LocationManager.onLocation( context, location, "alarm")
        });

        if (LocationManager.needFineLocation(context)) {
            fetcher.retrieveLocation()
        } else {
            fetcher.getLastLocation()
        }
    }
}