package com.discovmobile.bglocation.utils

import android.content.Context
import android.content.SharedPreferences

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

        // When the native module retrieves a location, it's passed to the frontend to check for discoveries
        // If the discovery request failed we don't want to store the location as the last tracked, so there is 2
        // steps: 1. When the location is retrieved is stored as candidate and 2. when we have a response from the
        // the frontend we store it as the actual last tested location
        @JvmStatic
        fun getCandidateLocation( context: Context ): BgLocation? {
            val location = getStore(context).getString("candidateLocation", null ) ?: return null;
            return BgLocation.fromString(location);
        }
        @JvmStatic
        fun setCandidateLocation( context: Context, location: BgLocation){
            getStore( context )
                    .edit()
                    .putString("candidateLocation", location.stringify() )
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
        fun getLastNetworkConnectionType( context: Context ): String {
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
        fun getLastLocationSource( context: Context ): String {
            return getStore( context ).getString("lastLocationSource", "none");
        }
        @JvmStatic
        fun setLastLocationSource( context: Context, networkType: String ){
            getStore( context )
                    .edit()
                    .putString("lastLocationSource", networkType)
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



    }
}