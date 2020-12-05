package com.discovmobile.bgtasks

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkInfo
import androidx.work.*
import com.discovmobile.bgtasks.utils.*
import java.util.*
import kotlin.math.abs

class LocationManager( context: Context, workerParameters: WorkerParameters) : Worker(context, workerParameters) {
  companion object {
    val FINE_LOCATION_INTERVAL = 2 * 60 * 60 * 1000 // Two hours

    @JvmStatic
    fun onLocation(context: Context, location: BgLocation, source: String) {
      val lastLocation = Storage.getLastLocation(context)
      if( needToUpdateLocation(lastLocation, location) ){
        Storage.setLastLocation( context, location )
        GeofenceHelper.start( context, location )
        MovementHelper.reportMoving(context)
        waitForConnectionAndSend( context, location, source )
      }
      MovementHelper.reportStill(context)
    }

    @JvmStatic
    fun needToUpdateLocation(prevLocation: BgLocation?, nextLocation: BgLocation): Boolean{
      if (prevLocation == null) return true

      val diff = abs(prevLocation.latitude - nextLocation.latitude) + abs(prevLocation.longitude - nextLocation.longitude)
      return diff > 0.0001;
    }

    @JvmStatic
    fun needFineLocation( context: Context ): Boolean {
      val lastLocation = Storage.getLastLocation(context) ?: return true

      val diff = Date().time - lastLocation.timestamp;
      Bglog.i("Time difference $diff");

      return MovementHelper.isMoving( context ) // || diff > 2 * FINE_LOCATION_INTERVAL;
    }

    private fun waitForConnectionAndSend(context: Context, location: BgLocation, source: String ){
      Bglog.i("********** Waiting for connection")
      val constraints = Constraints.Builder()
              .setRequiredNetworkType(NetworkType.CONNECTED)
              .build()
      val workRequest = OneTimeWorkRequest
              .Builder(LocationManager::class.java)
              .setConstraints(constraints)
              .build()
      WorkManager
              .getInstance(context)
              .enqueue(workRequest)
    }
  }

  override fun doWork(): Result {
    Bglog.i("********** Connection available.")
    val location = Storage.getLastLocation(applicationContext)
    if( location != null ){
      HeadlessService.sendLocation( applicationContext, location, "connectionAvailable" );
    }
    return Result.success()
  }
}

fun getActiveNetwork(context: Context): NetworkInfo? {
  val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
  return cm.activeNetworkInfo
}