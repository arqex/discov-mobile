package com.discovmobile.bgtasks;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BgAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bglog.i("Alarm broadcast received");
        LocationHelper.sendSignalToHeadless( context, "alarm");
        // Restart alarm
        LocationAlarm.start( context );
    }
}
