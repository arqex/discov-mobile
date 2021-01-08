package com.discovmobile.bglocation

import android.content.Context
import com.discovmobile.bglocation.utils.Storage
import java.util.*

class NotificationHelper {
    companion object {
        @JvmStatic
        fun checkCreateNotifications( context: Context? ) {
            if( context == null ) return
            checkBgLocationNotification(context)
        }
    }
}

// One day after we detected the not granted permission
const val REQUEST_MARGIN = 24 * 60 * 60 * 1000;
const val REPEAT_BG_LOCATION_INTERVAL = 2 * 30 * 24 * 60 * 60 * 1000
fun checkBgLocationNotification( context: Context ){
    val trackingMode = TrackHelper.getMode(context)
    if( trackingMode == TrackHelper.MODE_OFF || !LocationHelper.hasPermission(context) ) return

    val bgLocation = Storage.getBackgroundPermission(context)
    if( bgLocation == null || bgLocation.isGranted ) return


    val lastBgLocationNotificationAt = Storage.getLastBgLocationNotificationAt( context );
    if( lastBgLocationNotificationAt == null || lastBgLocationNotificationAt + REPEAT_BG_LOCATION_INTERVAL > Date().time ) return

    
    if( bgLocation.updatedAt + REQUEST_MARGIN < Date().time ){
        HeadlessService.openNotification( context, "bgLocationPermission" );
        Storage.setLastBgLocationNotificationAt(context, Date().time )
    }
}