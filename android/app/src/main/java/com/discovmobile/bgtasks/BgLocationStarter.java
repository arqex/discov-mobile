package com.discovmobile.bgtasks;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.discovmobile.bglocation.AlarmStarter;

public class BgLocationStarter extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bglog.i("Start intent received");
        LocationHelper.sendSignalToHeadless( context, "boot");
        setAlarm( context );
    }

    private void setAlarm( Context context ) {
        AlarmStarter starter = new AlarmStarter();
        starter.start( context );
    }
}