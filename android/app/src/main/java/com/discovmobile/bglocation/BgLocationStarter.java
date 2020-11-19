package com.discovmobile.bglocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BgLocationStarter extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("BgLocation", "Start intent received");
        Intent service = new Intent(context, IntervalLocationService.class);
        context.startService(service);
    }
}