package com.discovmobile.bgtasks

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.discovmobile.bgtasks.utils.Bglog
import com.discovmobile.bgtasks.utils.Storage
import com.google.android.gms.location.*
import java.util.*

class MovementHelper: BroadcastReceiver() {
    companion object {
        const val STILL = 0
        const val MOVING = 1
        val MOVEMENT_INERTIA = 5 * 60 * 1000

        @JvmStatic
        fun start( context: Context ) {
            ActivityRecognition.getClient(context)
                    .requestActivityTransitionUpdates(buildRequest(), getPedingIntent(context))
                    .addOnSuccessListener { Bglog.i("Activity recognizer added properly.") }
                    .addOnFailureListener { e ->
                        Bglog.i("Error adding activity recognizer.")
                        Bglog.e(e.message)
                    }
        }

        @JvmStatic
        fun isMoving( context: Context ): Boolean {
            return Storage.getMovingState( context ) != STILL;
        }

        @JvmStatic
        fun reportMoving( context: Context ){
            if( !isMoving(context) ){
                Storage.setMovingState( context, MOVING);
            }
            Storage.setLastMovingAt( context, Date().time );
        }

        @JvmStatic
        fun reportStill( context: Context ): Boolean {
            if( isMoving(context) ){
                val lastMovingAt = Storage.getLastMovingAt(context)
                if( lastMovingAt + MOVEMENT_INERTIA < Date().time ){
                    // After the inertia we confirm we are still
                    Storage.setMovingState(context, STILL);
                    return false
                }
                return true
            }
            return false
        }
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if( context == null ) return

        if (ActivityTransitionResult.hasResult(intent)) {
            Bglog.i("Activity transition result received")
            val result = ActivityTransitionResult.extractResult(intent)
            for (event in result!!.transitionEvents) {
                val isStill = event.transitionType == ActivityTransition.ACTIVITY_TRANSITION_ENTER;
                var activityType = "still"
                if( isStill ){
                    reportStill( context );
                }
                else {
                    activityType = "moving"
                    reportMoving( context )
                }

                HeadlessService.sendSignal(context, "activity_$activityType")
                Bglog.i("Transition event! $activityType")
            }
        } else {
            Bglog.i("Empty activity transition result received")
        }

        // Make sure bg tasks are alive
        LocationStarter.startAll( context, true );
    }
}

private fun buildRequest(): ActivityTransitionRequest {
    val transitions: MutableList<ActivityTransition> = ArrayList()
    transitions.add(ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build()
    )
    transitions.add(ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build()
    )

    return ActivityTransitionRequest(transitions)
}

private const val LISTENER_ID = 0;
private fun getPedingIntent(context: Context ): PendingIntent? {
    val intent = Intent(context, MovementHelper::class.java)
    return PendingIntent.getBroadcast(context, LISTENER_ID, intent, PendingIntent.FLAG_UPDATE_CURRENT);
}