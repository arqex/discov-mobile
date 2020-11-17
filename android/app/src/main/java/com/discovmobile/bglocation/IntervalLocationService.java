package com.discovmobile.bglocation;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;

public class IntervalLocationService extends Service {
	public static final int POLL_INTERVAL = 60000;
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
    	mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId){
		createPendingIntent();

		mAlarmManager.setRepeating(
			AlarmManager.RTC,
			System.currentTimeMillis(),
			POLL_INTERVAL,
			mLocationRetrieverPendingIntent
		);

		return START_NOT_STICKY;
	}

	@Nullable
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	private void createPendingIntent(){
        Intent i = new Intent(getApplicationContext(), LocationRetrieverService.class);
		mLocationRetrieverPendingIntent = PendingIntent.getService(getApplicationContext(), 0, i, PendingIntent.FLAG_UPDATE_CURRENT);
	}
}
