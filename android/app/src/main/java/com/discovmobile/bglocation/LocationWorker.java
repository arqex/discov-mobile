package com.discovmobile.bglocation;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;

public class LocationWorker extends Worker {
    public LocationWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.i("BgLocation", "************ The worker doing its work");

        LocationRetriever retriever = new LocationRetriever(new BgLocationListener() {
            @Override
            void onLocation(BgLocation location) {
                Log.i("BgLocation", "************ The worker has a location");
                LocationHelper.sendLocationToHeadless( getApplicationContext(), location, "Worker");
            }
        });

        return Result.success();
    }

    static void enqueueWork(Context context) {
        Log.i("BgLocation", "********* Equeuing work");
        Constraints constraints = new Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build();

        PeriodicWorkRequest workRequest =
            new PeriodicWorkRequest.Builder(LocationWorker.class, 15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .addTag("DISCOV_LOCATION_WORK")
                // Constraints
                .build();
        WorkManager.getInstance( context ).enqueueUniquePeriodicWork(
            "DISCOV_LOCATION_WORK",
            ExistingPeriodicWorkPolicy.KEEP,
            workRequest
        );
    }
}
