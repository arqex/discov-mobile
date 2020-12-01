package com.discovmobile.bgtasks.utils

import android.content.Context
import android.content.SharedPreferences

class Storage {
    companion object {
        val preferencesKey = "DISCOV"
        fun getStore( context: Context ): SharedPreferences{
            return context.getSharedPreferences( preferencesKey, Context.MODE_PRIVATE);
        }

        @JvmStatic
        fun getLastLocation( context: Context ): BgLocation? {
            val location = getStore(context).getString("lastLocation", null );
            if( location == null ) return null;
            return BgLocation.fromString( location );
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
        fun setLastMovingAt( context: Context, timestamp: Long ){
            getStore( context )
                    .edit()
                    .putLong("lastMovingAt", timestamp)
                    .apply()
        }
    }
}