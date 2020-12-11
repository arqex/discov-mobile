package com.discovmobile.bglocation

import android.app.Service
import android.content.Context
import android.content.Intent
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
                val intent = Intent(context, TrackHelper::class.java)
                intent.putExtra("type", "create")
                if( LocationHelper.needForegroundService(context) ){
                    context.startForegroundService(intent)
                }
                else {
                    context.startService(intent)
                }
            }

            if( prevMode == MODE_ACTIVE ){
                val intent = Intent(context, TrackHelper::class.java)
                context.stopService( intent )
            }

            Storage.setTrackingMode(context, mode)
        }

        @JvmStatic
        fun dismissActiveMode( context: Context ){
            Bglog.i("Dismissing active mode")
            setMode(context, MODE_PASSIVE)
            Storage.setTrackingDismissedAt( context, Date().time )
        }

        val DISMISS_TIME = 90000 // 2 * 60 * 60 * 1000
        @JvmStatic
        fun isActiveModeDismissed( context: Context ): Boolean {
            return Storage.getTrackingDismissedAt(context) + DISMISS_TIME > Date().time
        }
    }

    private lateinit var fetcher: LocationFetcher
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if( intent?.getStringExtra("type") == "dismiss" ) {
            dismissActiveMode( applicationContext )
        }
        else {
            Bglog.i("Creating active notification")
            LocationHelper.openNotification( this )
            fetcher = LocationFetcher( applicationContext) {
                it.source = "foreground"
                LocationManager.onLocation(applicationContext, it)
                if( !MovementHelper.isMoving(applicationContext) ){
                    setMode( applicationContext, MODE_PASSIVE)
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