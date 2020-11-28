package com.discovmobile.bglocation;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.util.Log;

public class AlarmStarter {
    public static final int POLL_INTERVAL = 60000;

    private AlarmManager mAlarmManager;
    private PendingIntent mLocationRetrieverPendingIntent;

    public void start(Context context){
        Log.i("BgLocation", "Setting repeating alarm");
        createPendingIntent(context);
        createAlarmManager(context);

        mAlarmManager.set(
            AlarmManager.ELAPSED_REALTIME_WAKEUP,
            SystemClock.elapsedRealtime() + POLL_INTERVAL,
            mLocationRetrieverPendingIntent
        );
    }

    private void createPendingIntent(Context context){
        Log.i ("BgLocation", "Creating interval location service.");
        Intent i = new Intent(context, LocationRetrieverService.class);
        mLocationRetrieverPendingIntent = PendingIntent.getService(context, 0, i, PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private void createAlarmManager(Context context){
        mAlarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    }
}
