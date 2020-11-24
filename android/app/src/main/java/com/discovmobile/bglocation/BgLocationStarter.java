package com.discovmobile.bglocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BgLocationStarter extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("BgLocation", "Start intent received");
        setAlarm( context );
    }

    private void setAlarm( Context context ) {
        AlarmStarter starter = new AlarmStarter();
        starter.start( context );
    }

}