package com.discovmobile.bgtasks

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit


private val WORK_NAME = "DISCOV_LOCATION_WORK"

class WorkerHelper( context: Context, workerParameters: WorkerParameters) : Worker(context, workerParameters) {
    companion object {
        fun start( context: Context ) {
            Bglog.i("********** Enqueuing work")
            val constraints = Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()

            val workRequest = PeriodicWorkRequest.Builder( WorkerHelper::class.java, 15, TimeUnit.MINUTES )
                    .setConstraints( constraints )
                    .addTag( WORK_NAME )
                    .build()

            WorkManager.getInstance( context )
                    .enqueueUniquePeriodicWork( WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, workRequest )

            LocationHelper.sendSignalToHeadless(context, "work_enqueued")
        }
    }
    override fun doWork(): Result {
        Bglog.i("************ The worker doing its work")
        LocationHelper.sendSignalToHeadless(applicationContext, "worker")
        return Result.success()
    }
}