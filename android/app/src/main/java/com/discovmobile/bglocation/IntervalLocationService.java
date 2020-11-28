package com.discovmobile.bglocation;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

public class IntervalLocationService extends Service {
	public static final String LOCATION_EVENT_NAME = "com.discovmobile.bglocation_INFO";
	public static final String LOCATION_EVENT_DATA_NAME = "LocationData";
	public static final String JS_LOCATION_LAT_KEY = "latitude";
	public static final String JS_LOCATION_LON_KEY = "longitude";
	public static final String JS_LOCATION_TIME_KEY = "timestamp";
	public static final String JS_LOCATION_EVENT_NAME = "location_received";

	private AlarmManager mAlarmManager;
	private PendingIntent mLocationRetrieverPendingIntent;

	@Override
	public void onCreate() {
		super.onCreate();
		setAlarm();
		Log.i ("BgLocation", "Creating interval location service.");
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId){
		Log.i ("BgLocation", "Creating repeating alarm for the location.");


		return START_STICKY;
	}

	private void setAlarm() {
		AlarmStarter starter = new AlarmStarter();
		starter.start( getApplicationContext() );
	}

	@Nullable
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		Log.i("BgLocation", "Destroying interval location Service. Trying to restart bg location");
		Intent restartIntent = new Intent("restartDiscovLocation");
		sendBroadcast(restartIntent);
		LocationWorker.enqueueWork( getApplicationContext() );
	}
}
