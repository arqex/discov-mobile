package com.discovmobile.bgtasks;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BgAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bglog.i("Alarm broadcast received");
        // Send a sign
        LocationHelper.sendSignalToHeadless( context, "alarm");
        // Get a location
        updateLocation(context);
        // Restart alarm
        LocationAlarm.start( context );
    }

    void updateLocation( Context context ){
        LocationRetriever retriever = new LocationRetriever(new BgLocationListener() {
            @Override
            void onLocation(BgLocation location) {
                LocationHandler.handleLocation( context, location, "alarm");
            }
        });

        if( LocationHandler.needFineLocation(context) ){
            retriever.retrieveLocation(context);
        }
        else {
            retriever.getLastLocation(context);
        }
    }
}
