package com.discovmobile.bglocation;

import android.Manifest;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.discovmobile.MainActivity;
import com.google.gson.Gson;

import java.util.List;

public class LocationHelper {
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    public static final int NOTIFICATION_ID = 1;

    static void sendLocationToHeadless(Context context, BgLocation location) {
        Log.i ("BgLocation", "Sending location to headless.");
        Intent headlessIntent = new Intent(context, HeadlessJSLocationService.class );
        Bundle bundle = new Bundle();
        bundle.putString("location", (new Gson()).toJson( location ));
        headlessIntent.putExtras(bundle);
        if ( LocationHelper.needForegroundService(context) ) {
            Log.i("BgLocation", "Starting service as foreground");
            context.startForegroundService(headlessIntent);
        } else {
            Log.i("BgLocation", "Starting service as background");
            context.startService(headlessIntent);
        }
    }

    static boolean needForegroundService( Context context ) {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !LocationHelper.isAppOnForeground( context );
    }

    static boolean isAppOnForeground(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    static boolean isLocationPermissionGranted( Context context ) {
        return ContextCompat.checkSelfPermission( context, Manifest.permission.ACCESS_FINE_LOCATION ) == PackageManager.PERMISSION_GRANTED;
    }

    static void openNotification( Service service ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Discov location channel",
                NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = service.getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }

        Intent notificationIntent = new Intent(service, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(service, 0, notificationIntent, 0);

        Notification notification = new NotificationCompat.Builder(service, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .build();

        Log.i ("BgLocation", "Starting notification.");
        service.startForeground(NOTIFICATION_ID, notification);
    }

    static void closeNotification( Service service ) {
        service.stopForeground( true );
    }
}
