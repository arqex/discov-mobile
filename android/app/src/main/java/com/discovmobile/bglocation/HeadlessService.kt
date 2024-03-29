package com.discovmobile.bglocation

import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.discovmobile.bglocation.utils.BgLocation
import com.discovmobile.bglocation.utils.Bglog
import com.discovmobile.bglocation.utils.Storage
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

private val TASK_NAME = "DISCOV_HEADLESS_LOCATION"

class HeadlessService: HeadlessJsTaskService() {
    companion object {
        @JvmStatic
        fun send( context: Context?, map: HashMap<String, String> ){
            if( context == null ) return;

            val intent = Intent( context, HeadlessService::class.java )
            val bundle = Bundle()

            for( entry in map ){
                bundle.putString( entry.key, entry.value )
            }

            intent.putExtras(bundle);
            if(LocationHelper.needForegroundService(context)){
                Bglog.i("Starting headless service as foreground")
                context.startForegroundService(intent)
            }
            else {
                Bglog.i("Starting headless service as background")
                context.startService(intent)
            }
        }

        @JvmStatic
        fun sendSignal( context: Context?, signal: String ){
            if( context != null ){
                val isDebugMode = Storage.getDebugMode( context );
                if( isDebugMode ){
                    Bglog.i("Sending signal: $signal")
                    send( context, hashMapOf("signal" to signal) )
                }
            }
        }

        @JvmStatic
        fun sendLocation(context: Context?, location: BgLocation, source: String = ""){
            Bglog.i("Sending location: ${location.timestamp}")
            send( context, hashMapOf("location" to location.stringify(), "source" to source) )
        }

        @JvmStatic
        fun openNotification( context: Context?, notificationId: String ){
            send( context, hashMapOf("notificationId" to notificationId) )
        }
    }

    override fun onHeadlessJsTaskStart(taskId: Int) {
        super.onHeadlessJsTaskStart(taskId)
        Bglog.i("Starting headless task")
        if(LocationHelper.needForegroundService(applicationContext)){
            LocationHelper.openNotification(this)
        }
    }

    override fun onHeadlessJsTaskFinish(taskId: Int) {
        super.onHeadlessJsTaskFinish(taskId)
        Bglog.i("Headless task finished")
        if(LocationHelper.needForegroundService(applicationContext)){
            LocationHelper.closeNotification(this)
        }
    }

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        if( intent?.extras !== null ) {
            return HeadlessJsTaskConfig( TASK_NAME, Arguments.fromBundle(intent.extras), 5000, true )
        }
        return null;
    }

    override fun onDestroy() {
        super.onDestroy()
        Bglog.i("Destroying headless service")
    }
}