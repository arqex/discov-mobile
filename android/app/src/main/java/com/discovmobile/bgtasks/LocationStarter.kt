package com.discovmobile.bgtasks

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.discovmobile.bgtasks.utils.Bglog

class LocationStarter: BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        Bglog.i("Start intent received")
        HeadlessService.sendSignal(context, "boot")
        AlarmHelper.start( context )
    }
}