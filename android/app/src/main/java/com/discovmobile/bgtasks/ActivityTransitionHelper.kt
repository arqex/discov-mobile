package com.discovmobile.bgtasks

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.android.gms.location.*
import java.util.*

class ActivityTransitionHelper: BroadcastReceiver() {
    companion object {
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
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (ActivityTransitionResult.hasResult(intent)) {
            Bglog.i("Activity transition result received")
            val result = ActivityTransitionResult.extractResult(intent)
            for (event in result!!.transitionEvents) {
                val activityType = if (event.transitionType == ActivityTransition.ACTIVITY_TRANSITION_ENTER) "still" else "moving"
                LocationHelper.sendSignalToHeadless(context, "activity_$activityType")
                Bglog.i("Transitition event! $event")
            }
        } else {
            Bglog.i("Empty activity transition result received")
        }
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

private fun getPedingIntent(context: Context ): PendingIntent? {
    val intent = Intent(context, ActivityTransitionHelper::class.java)
    return PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
}