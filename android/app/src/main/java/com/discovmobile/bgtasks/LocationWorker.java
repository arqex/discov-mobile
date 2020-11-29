package com.discovmobile.bgtasks;

import android.content.Context;

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
        Bglog.i("************ The worker doing its work");
        LocationHelper.sendSignalToHeadless(getApplicationContext(), "worker");
        return Result.success();
    }

    public static void enqueueWork(Context context) {
        Bglog.i( "********* Equeuing work");
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

        LocationHelper.sendSignalToHeadless(context, "work_enqueued");
    }
}
