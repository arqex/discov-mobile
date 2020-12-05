package com.discovmobile.bgtasks

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkInfo
import com.discovmobile.bgtasks.utils.*
import java.util.*

class LocationManager {
  companion object {
    val FINE_LOCATION_INTERVAL = 2 * 60 * 60 * 1000 // Two hours

    @JvmStatic
    fun onLocation(context: Context, location: BgLocation, source: String) {
      val lastLocation = Storage.getLastLocation(context)
      if( needToUpdateLocation(lastLocation, location) ){
        HeadlessService.sendLocation( context, location, source )
        Storage.setLastLocation( context, location )
        GeofenceHelper.start( context, location )
        MovementHelper.reportMoving(context)
      }
      MovementHelper.reportStill(context)
    }

    @JvmStatic
    fun needToUpdateLocation(prevLocation: BgLocation?, nextLocation: BgLocation): Boolean{
      if (prevLocation == null) return true

      val diff = Math.abs(prevLocation.latitude - nextLocation.latitude) + Math.abs(prevLocation.longitude - nextLocation.longitude)
      return diff > 0.0001;
    }

    @JvmStatic
    fun needFineLocation( context: Context ): Boolean {
      val lastLocation = Storage.getLastLocation(context)
      if( lastLocation == null ) return true

      val diff = Date().time - lastLocation.timestamp;
      Bglog.i("Time difference $diff");

      return MovementHelper.isMoving( context ) // || diff > 2 * FINE_LOCATION_INTERVAL;
    }
  }
}

fun getActiveNetwork(context: Context): NetworkInfo? {
  val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
  return cm.activeNetworkInfo
}