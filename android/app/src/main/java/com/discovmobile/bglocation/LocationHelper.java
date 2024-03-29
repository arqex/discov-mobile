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
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.discovmobile.MainActivity;
import com.discovmobile.R;
import com.discovmobile.bglocation.utils.Bglog;

import java.util.Date;
import java.util.List;

import kotlin.jvm.JvmStatic;

public class LocationHelper {
    public static final String CHANNEL_ID = "DiscovLocationChannel";
    public static final int NOTIFICATION_ID = 1;

    static public boolean needForegroundService( Context context ) {
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
                NotificationManager.IMPORTANCE_LOW
            );

            serviceChannel.enableVibration(false);
            serviceChannel.setSound(null, null);
            serviceChannel.enableLights(false);

            NotificationManager manager = service.getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }

        Intent notificationIntent = new Intent(service, MainActivity.class);
        notificationIntent.putExtra("source", "locationNotification");
        notificationIntent.putExtra("notificationPostTime", (new Date()).getTime() );
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(service, 0, notificationIntent, 0);

        Intent dismissIntent = new Intent(service, TrackHelper.class);
        dismissIntent.putExtra("type", "dismiss");
        PendingIntent dismissPendingIntent = PendingIntent.getService(service, 0, dismissIntent, 0);

        Notification notification = new NotificationCompat.Builder(service, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.drawable.ic_location_notification)
                .setContentTitle("You are close to discover a story!")
                .setContentText("Location is now active to find it as soon as you get into the discovery area.")
                .addAction(R.mipmap.ic_launcher, "Stop location", dismissPendingIntent)
                .build();

        Bglog.i ("Starting notification.");
        service.startForeground(NOTIFICATION_ID, notification);
    }

    static void closeNotification( Service service ) {
        service.stopForeground( true );
    }

    @JvmStatic
    static boolean hasPermission( Context context ){
        return ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @JvmStatic
    static boolean hasBackgroundPermission( Context context ){
        return ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }
}
