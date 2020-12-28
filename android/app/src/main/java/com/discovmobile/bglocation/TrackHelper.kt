package com.discovmobile.bglocation

import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import com.discovmobile.bglocation.utils.Bglog
import com.discovmobile.bglocation.utils.Storage
import java.util.*

class TrackHelper: Service() {
    companion object {
        const val MODE_OFF = 0
        const val MODE_ACTIVE = 1
        const val MODE_PASSIVE = 2
        @JvmStatic
        fun getMode(context: Context): Int{
            return Storage.getTrackingMode(context)
        }

        @JvmStatic
        fun setMode(context: Context, mode: Int){
            val prevMode = getMode((context))
            if( prevMode == mode ) return;
            if( mode > 2 || mode < 0 ) return;

            if( mode == MODE_ACTIVE ){
                startTrackingService(context, true)
            }
            if( prevMode == MODE_ACTIVE ){
                stopTrackingService(context)
                if( Storage.isForegroundTracking(context) ){
                    startForegroundTracking(context)
                }
            }

            Storage.setTrackingMode(context, mode)
        }

        @JvmStatic
        fun dismissActiveMode(context: Context){
            Bglog.i("Dismissing active mode")
            setMode(context, MODE_PASSIVE)
            Storage.setTrackingDismissedAt(context, Date().time)
        }

        val DISMISS_TIME = 90000 // 2 * 60 * 60 * 1000
        @JvmStatic
        fun isActiveModeDismissed(context: Context): Boolean {
            return Storage.getTrackingDismissedAt(context) + DISMISS_TIME > Date().time
        }
        @JvmStatic
        fun startForegroundTracking(context: Context) {
            Storage.setForegroundTracking(context, true);
            if( getMode(context) == MODE_PASSIVE ){
                startTrackingService(context, false)
            }
        }
        @JvmStatic
        fun stopForegroundTracking(context: Context) {
            if( Storage.isForegroundTracking(context) ){
                Storage.setForegroundTracking(context, false);
                if( getMode(context) == MODE_PASSIVE ){
                    stopTrackingService(context)
                }
            }
        }

        private fun startTrackingService(context: Context, asForegroundService: Boolean) {
            val intent = Intent(context, TrackHelper::class.java)
            intent.putExtra("type", "create")
            if( Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && asForegroundService ){
                intent.putExtra("asForegroundService", true);
                context.startForegroundService(intent)
            }
            else {
                intent.putExtra("asForegroundService", false);
                context.startService(intent)
            }
        }
        private fun stopTrackingService(context: Context) {
            val intent = Intent(context, TrackHelper::class.java)
            context.stopService(intent)
        }

        private fun isForegroundTracking(context: Context): Boolean {
            val isFGActive = Storage.isForegroundTracking(context);
            if( !isFGActive ) return false;

            val isAppOnForeground = LocationHelper.isAppOnForeground(context);
            if( isAppOnForeground ){
                return true;
            }

            Storage.setForegroundTracking(context, false);
            return false;
        }



    }

    private lateinit var fetcher: LocationFetcher
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if( intent?.getStringExtra("type") == "dismiss" ) {
            dismissActiveMode(applicationContext)
        }
        else {
            val asForegroundService = intent?.getBooleanExtra("asForegroundService", false);
            if( asForegroundService != null && asForegroundService ) {
                Bglog.i("Creating active notification")
                LocationHelper.openNotification(this)
            }

            fetcher = LocationFetcher(applicationContext) {
                it.source = "foreground"
                LocationManager.onLocation(applicationContext, it)
                if( !MovementHelper.isMoving(applicationContext) ){
                    setMode(applicationContext, MODE_PASSIVE)
                }
            }
            fetcher.listenToLocations()
        }
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onDestroy() {
        super.onDestroy()
        fetcher?.stopListening()
    }

    override fun onBind(p0: Intent?): IBinder? {
        TODO("Not yet implemented")
    }
}