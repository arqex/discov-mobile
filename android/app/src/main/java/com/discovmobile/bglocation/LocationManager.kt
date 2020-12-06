package com.discovmobile.bglocation

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import androidx.work.*
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.discovmobile.bglocation.utils.BgLocation
import com.discovmobile.bglocation.utils.Bglog
import com.discovmobile.bglocation.utils.Storage
import java.util.*
import kotlin.math.abs


class LocationManager(context: Context, workerParameters: WorkerParameters) : Worker(context, workerParameters) {
  companion object {
    val FINE_LOCATION_INTERVAL = 2 * 60 * 60 * 1000 // Two hours

    @JvmStatic
    fun onLocation(context: Context, location: BgLocation, source: String) {
      val lastLocation = Storage.getLastLocation(context)
      if( needToUpdateLocation(lastLocation, location) ){
        Storage.setLastLocation(context, location)
        Storage.setLastLocationSource(context, source)
        GeofenceHelper.start(context, location)
        MovementHelper.reportMoving(context)
        waitForConnectionAndSend(context, location, source)
      }
      MovementHelper.reportStill(context)
    }

    @JvmStatic
    fun onDistanceToDiscovery( context: Context, distance: Double ) {
      val prevDistance = Storage.getDistanceToDiscovery(context)
      Storage.setDistanceToDiscovery(context, distance.toFloat())

      if (prevDistance > 200 && distance < 200 && !TrackHelper.isActiveModeDismissed(context)) {
        TrackHelper.setMode(context, TrackHelper.MODE_ACTIVE);
      }
      else if (TrackHelper.getMode(context) == TrackHelper.MODE_ACTIVE && (distance > 200 || !MovementHelper.isMoving(context))) {
        TrackHelper.setMode(context, TrackHelper.MODE_PASSIVE);
      }
    }

    @JvmStatic
    fun needToUpdateLocation(prevLocation: BgLocation?, nextLocation: BgLocation): Boolean{
      if (prevLocation == null) return true

      val diff = abs(prevLocation.latitude - nextLocation.latitude) + abs(prevLocation.longitude - nextLocation.longitude)
      return diff > 0.0001;
    }

    @JvmStatic
    fun needFineLocation(context: Context): Boolean {
      val lastLocation = Storage.getLastLocation(context) ?: return true

      val diff = Date().time - lastLocation.timestamp;
      Bglog.i("Time difference $diff");

      return MovementHelper.isMoving(context) || isGoingToMobileNetwork(context) // || diff > 2 * FINE_LOCATION_INTERVAL;
    }

    private fun waitForConnectionAndSend(context: Context, location: BgLocation, source: String){
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

    private fun isGoingToMobileNetwork(context: Context): Boolean{
      val prevNetworkType = Storage.getLastNetworkConnectionType(context);
      val currentNetworkType = getNetworkType(context);

      // Save the network type
      Storage.setLastNetworkConnectionType(context, currentNetworkType);
      val result = currentNetworkType == "mobile" && prevNetworkType != "mobile";
      if( result ){
        Bglog.i("*** Going to mobile network");
      }
      return result;
    }
  }

  override fun doWork(): Result {
    Bglog.i("********** Connection available: ${getNetworkType(applicationContext)}")
    tryDummyRequest(applicationContext);
    val location = Storage.getLastLocation(applicationContext)
    val source = Storage.getLastLocationSource(applicationContext)
    if( location != null ){
      HeadlessService.sendLocation(applicationContext, location, "$source:${getNetworkType(applicationContext)}");
    }
    return Result.success()
  }
}

@SuppressWarnings("deprecation")
fun getNetworkType(context: Context): String{
  val connectivityMgr = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
  if (connectivityMgr != null) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      val activeNetwork = connectivityMgr.getNetworkCapabilities(connectivityMgr.activeNetwork)
      if( activeNetwork == null ){
        return "none"
      }
      if (activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
        return "wifi"
      }
      if (activeNetwork.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
        return "mobile"
      }
    }
    else {
      val networkInfo = connectivityMgr.activeNetworkInfo
      if( networkInfo == null ){
        return "none"
      }
      if (networkInfo.type == ConnectivityManager.TYPE_WIFI) {
        return "wifi";
      }
      if (networkInfo.type == ConnectivityManager.TYPE_MOBILE) {
        return "mobile";
      }
    }
  }

  return "none"
}

fun tryDummyRequest(context: Context){
  val queue = Volley.newRequestQueue(context)
  val stringRequest = StringRequest(
          Request.Method.POST,
          "https://gql-dev.discov.me/gql",
          {
          },
          {
            if (it?.networkResponse?.statusCode == 401 ) {
              Bglog.i("OKOKOK Dummy request ok")
            } else {
              Bglog.w("^^^ Dummy request error")
              Bglog.e(it.message)
            }
          }
   )
  queue.add(stringRequest)
}