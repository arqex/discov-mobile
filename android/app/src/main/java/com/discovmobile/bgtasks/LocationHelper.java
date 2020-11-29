package com.discovmobile.bgtasks;

import android.Manifest;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.discovmobile.MainActivity;
import com.discovmobile.R;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class LocationHelper {
    public static final String CHANNEL_ID = "DiscovLocationChannel";
    public static final int NOTIFICATION_ID = 1;

    static void sendToHeadless(Context context, HashMap<String, String> map ){
        Intent headlessIntent = new Intent(context, HeadlessJSLocationService.class );
        Bundle bundle = new Bundle();
        for (Map.Entry<String, String> set : map.entrySet()) {
            bundle.putString(set.getKey(), set.getValue());
        }
        headlessIntent.putExtras(bundle);
        if ( LocationHelper.needForegroundService(context) ) {
            Bglog.i( "Starting service as foreground");
            context.startForegroundService(headlessIntent);
        } else {
            Bglog.i( "Starting service as background");
            context.startService(headlessIntent);
        }
    }

    static void sendSignalToHeadless(Context context, String signal) {
        Bglog.i( "Sending signal to headless: " + signal);
        HashMap<String, String> payload = new HashMap<String, String>();
        payload.put("signal", signal);
        LocationHelper.sendToHeadless( context, payload );
    }

    static void sendLocationToHeadless(Context context, BgLocation location, String source) {
        Log.i ("BgLocation", "Sending location to headless.");
        HashMap<String, String> payload = new HashMap<String, String>();
        payload.put("location", (new Gson()).toJson( location ));
        payload.put("source", source);
        LocationHelper.sendToHeadless( context, payload );
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

            serviceChannel.enableVibration(false);
            serviceChannel.setSound(null, null);
            serviceChannel.enableLights(false);

            NotificationManager manager = service.getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }

        Intent notificationIntent = new Intent(service, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(service, 0, notificationIntent, 0);

        Notification notification = new NotificationCompat.Builder(service, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.drawable.icon)
                .setContentTitle("You are close to discover a story!")
                .setContentText("Location is now active to discovery as soon as you get into the discovery area.")
                .build();

        Log.i ("BgLocation", "Starting notification.");
        service.startForeground(NOTIFICATION_ID, notification);
    }

    static void closeNotification( Service service ) {
        service.stopForeground( true );
    }

}
