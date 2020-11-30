package com.discovmobile.bgtasks

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class LocationStarter: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        Bglog.i("Start intent received")
        LocationHelper.sendSignalToHeadless(context, "boot")
        AlarmHelper.start( context )
    }
}