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
                    .commit();
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
                    .commit()
        }
    }
}