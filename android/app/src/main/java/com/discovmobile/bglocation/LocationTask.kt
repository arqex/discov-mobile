package com.discovmobile.bglocation

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.discovmobile.bglocation.utils.Bglog

class LocationTask: Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Bglog.i("Starting location service")
        LocationStarter.startAll(applicationContext);
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onDestroy() {
        super.onDestroy()
        Bglog.i( "Destroying location service. Retry to load the worker.")
        WorkerHelper.start(applicationContext)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null;
    }
}