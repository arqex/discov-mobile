package com.discovmobile.bgtasks;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;

public class LocationAlarm {
    public static final int POLL_INTERVAL = 60000;

    static void start( Context context ){
        Bglog.i("Setting alarm");

        // Create intent
        Intent i = new Intent(context, BgAlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getService(context, 0, i, PendingIntent.FLAG_UPDATE_CURRENT);

        // Alarm manager
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        // Set alarm
        manager.set(
            AlarmManager.ELAPSED_REALTIME_WAKEUP,
            SystemClock.elapsedRealtime() + POLL_INTERVAL,
            pendingIntent
        );
    }
}
