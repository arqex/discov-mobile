package com.discovmobile.bglocation.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Storage {
    companion object {
        private const val preferencesKey = "DISCOV"
        private fun getStore(context: Context ): SharedPreferences{
            return context.getSharedPreferences( preferencesKey, Context.MODE_PRIVATE);
        }

        @JvmStatic
        fun getLastLocation( context: Context ): BgLocation? {
            val location = getStore(context).getString("lastLocation", null ) ?: return null;
            return BgLocation.fromString(location);
        }
        @JvmStatic
        fun setLastLocation( context: Context, location: BgLocation){
            getStore( context )
                    .edit()
                    .putString("lastLocation", location.stringify() )
                    .apply();
        }

        @JvmStatic
        fun getLastAlarmAt( context: Context ): Long{
            return getStore( context ).getLong("lastAlarmAt", 0);
        }
        @JvmStatic
        fun setLastAlarmAt( context: Context, timestamp: Long ){
            getStore( context )
                    .edit()
                    .putLong("lastAlarmAt", timestamp)
                    .apply()
        }

        @JvmStatic
        fun getMovingState( context: Context ): Int {
            return getStore( context ).getInt("movingState", 1 );
        }
        @JvmStatic
        fun setMovingState( context: Context, state: Int ){
            getStore( context)
                    .edit()
                    .putInt("movingState", state)
                    .apply()
        }
        @JvmStatic
        fun getLastMovingAt( context: Context ): Long{
            return getStore( context ).getLong("lastMovingAt", 0);
        }
        @JvmStatic
        fun setLastMovingAt( context: Context, timestamp: Long ) {
            getStore(context)
                    .edit()
                    .putLong("lastMovingAt", timestamp)
                    .apply()
        }

        @JvmStatic
        fun getLastNetworkConnectionType( context: Context ): String? {
            return getStore( context ).getString("lastConnectionType", "none");
        }
        @JvmStatic
        fun setLastNetworkConnectionType( context: Context, networkType: String ){
            getStore( context )
                    .edit()
                    .putString("lastConnectionType", networkType)
                    .apply()
        }
        @JvmStatic
        fun getDistanceToDiscovery( context: Context ): Float {
            return getStore( context ).getFloat("distanceToDiscovery", -1f);
        }
        @JvmStatic
        fun setDistanceToDiscovery( context: Context, networkType: Float ){
            getStore( context )
                    .edit()
                    .putFloat("distanceToDiscovery", networkType)
                    .apply()
        }

        @JvmStatic
        fun getTrackingMode( context: Context ): Int {
            return getStore( context ).getInt("trackingMode", 2);
        }
        @JvmStatic
        fun setTrackingMode( context: Context, networkType: Int ){
            getStore( context )
                    .edit()
                    .putInt("trackingMode", networkType)
                    .apply()
        }

        @JvmStatic
        fun getTrackingDismissedAt( context: Context ): Long {
            return getStore( context ).getLong("trackingDismissedAt", 0);
        }
        @JvmStatic
        fun setTrackingDismissedAt( context: Context, timestamp: Long ){
            getStore( context )
                    .edit()
                    .putLong("trackingDismissedAt", timestamp)
                    .apply()
        }

        @JvmStatic
        fun getLocationQueue( context: Context ): ArrayList<BgLocation> {
            val stringArray = getStore( context ).getString("locationQueue", "[]")
            class Token : TypeToken<ArrayList<BgLocation>>()
            return (Gson()).fromJson<ArrayList<BgLocation>>( stringArray, Token().type )
        }
        @JvmStatic
        fun saveLocationQueue( context: Context, queue: ArrayList<BgLocation> ){
            val stringArray = Gson().toJson( queue )
            getStore( context )
                    .edit()
                    .putString("locationQueue", stringArray)
                    .apply()
        }

        @JvmStatic
        fun isForegroundTracking( context: Context ): Boolean {
            return getStore(context).getBoolean("fgTracking", false)
        }
        @JvmStatic
        fun setForegroundTracking( context: Context, isActive: Boolean ){
            getStore( context )
                    .edit()
                    .putBoolean("fgTracking", isActive)
                    .apply()
        }

        @JvmStatic
        fun getBackgroundPermission( context: Context ): BgLocationPermission? {
            val permission = getStore( context ).getString("locationPermission", "");
            if( permission == null || permission == "" ){
                return null;
            }
            return BgLocationPermission.fromString(permission);
        }
        @JvmStatic
        fun saveBackgroundPermission( context: Context, permission: BgLocationPermission ){
            getStore( context )
                    .edit()
                    .putString("locationPermission", permission.stringify())
                    .apply()
        }

        @JvmStatic
        fun getLastBuildAt( context: Context ): Long? {
            return getStore( context ).getLong("lastBuildAt", 0)
        }
        @JvmStatic
        fun setLastBuildAt( context: Context, buildAt: Long ){
            getStore( context )
                    .edit()
                    .putLong("lastBuildAt", buildAt)
                    .apply()
        }

        @JvmStatic
        fun getLastBgLocationNotificationAt( context: Context ): Long? {
            return getStore( context ).getLong("lalstBgLocationNotificationAt", 0)
        }
        @JvmStatic
        fun setLastBgLocationNotificationAt( context: Context, lastnotificationAt: Long ){
            getStore( context )
                    .edit()
                    .putLong("lalstBgLocationNotificationAt", lastnotificationAt)
                    .apply()
        }
    }
}