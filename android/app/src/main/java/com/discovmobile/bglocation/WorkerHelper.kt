package com.discovmobile.bglocation

import android.content.Context
import androidx.work.*
import com.discovmobile.bglocation.utils.Bglog
import com.discovmobile.bglocation.utils.Storage
import java.util.concurrent.TimeUnit


private val WORK_NAME = "DISCOV_LOCATION_WORK"
private val INTERVAL_MINUTES = 15L

class WorkerHelper( context: Context, workerParameters: WorkerParameters) : Worker(context, workerParameters) {
    companion object {
        fun start( context: Context ) {
            Bglog.i("********** Enqueuing work")
            val constraints = Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()

            val workRequest = PeriodicWorkRequest
                    .Builder( WorkerHelper::class.java, INTERVAL_MINUTES, TimeUnit.MINUTES )
                    .setConstraints( constraints )
                    .addTag( WORK_NAME )
                    .build()

            WorkManager.getInstance( context )
                    .enqueueUniquePeriodicWork( WORK_NAME, getWorkPolicy(context), workRequest )
        }

        fun getWorkPolicy( context: Context ): ExistingPeriodicWorkPolicy {
            val info = context?.packageManager?.getPackageInfo( context?.packageName, 0);
            if( info != null ){
                val lastBuild = Storage.getLastBuildAt(context);
                Bglog.i( "Buildcode ${info.lastUpdateTime.toString()}" );
                if( lastBuild != info.lastUpdateTime ){
                    Bglog.i( "!!! Replacing worker" );
                    Storage.setLastBuildAt(context, info.lastUpdateTime)
                    return ExistingPeriodicWorkPolicy.REPLACE
                }
            }
            return ExistingPeriodicWorkPolicy.KEEP
        }
    }
    override fun doWork(): Result {
        Bglog.i("************ The worker doing its work")
        HeadlessService.sendSignal(applicationContext, "worker");
        // Make sure bg tasks are alive
        LocationStarter.startAll(applicationContext, true);
        return Result.success()
    }
}