package com.discovmobile.bgtasks;

import android.content.Context;

import java.util.Date;

import javax.annotation.Nullable;

public class LocationHandler {
    static void handleLocation( Context context, BgLocation location, String source ){
        BgLocation lastLocation = Storage.getLastLocation( context );
        if( needToUpdateLocation( lastLocation, location ) ){
            LocationHelper.sendLocationToHeadless( context, location, source );
            Storage.setLastLocation( context, location );
        }
    }

    static boolean needToUpdateLocation( @Nullable BgLocation prevLocation, BgLocation nextLocation ){
        if( prevLocation == null ) return true;
        double diff = Math.abs(prevLocation.latitude - nextLocation.latitude) + Math.abs(prevLocation.longitude - nextLocation.longitude);
        Bglog.i("Location difference " + diff );
        return (diff > 0.0001);
    }

    static boolean needFineLocation( Context context ){
        BgLocation lastLocation = Storage.getLastLocation( context );
        if( lastLocation == null ) return true;

        float difference = (new Date()).getTime() - lastLocation.timestamp;
        Bglog.i("Time difference " + difference );
        return false;
    }
}
