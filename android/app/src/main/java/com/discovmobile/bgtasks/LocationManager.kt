package com.discovmobile.bgtasks

import android.content.Context
import com.discovmobile.bgtasks.utils.*
import java.util.*

class LocationManager {
  companion object {
    @JvmStatic
    fun onLocation(context: Context, location: BgLocation, source: String) {
      val lastLocation = Storage.getLastLocation(context)
      if(needToUpdateLocation(lastLocation, location)){
        HeadlessService.sendLocation( context, location, source )
        Storage.setLastLocation( context, location )
      }
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
      Bglog.i("Time difference $diff")
      return false;
    }
  }
}