package com.discovmobile.bgtasks

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.SystemClock

class AlarmService: BroadcastReceiver() {
    companion object {
        val POLL_INTERVAL = 60000
        @JvmStatic
        fun start(context: Context?){
            Bglog.i("Setting alarm")

            // Create intent
            val i = Intent(context, AlarmManager::class.java)
            val pendingIntent = PendingIntent.getBroadcast(context, 0, i, PendingIntent.FLAG_UPDATE_CURRENT)

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
        LocationHelper.sendSignalToHeadless(context, "alarm")
        // Get a location
        if( context !== null ){
            updateLocation(context)
        }
        // Restart alarm
        AlarmService.start(context)
    }

    fun updateLocation(context: Context){
        val retriever = LocationRetriever(object : BgLocationListener() {
            override fun onLocation(location: BgLocation) {
                LocationHandler.handleLocation(context, location, "alarm")
            }
        })

        if (LocationHandler.needFineLocation(context)) {
            retriever.retrieveLocation(context)
        } else {
            retriever.getLastLocation(context)
        }
    }
}