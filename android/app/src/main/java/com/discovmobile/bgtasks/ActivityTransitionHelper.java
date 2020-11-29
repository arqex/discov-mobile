package com.discovmobile.bgtasks;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityTransition;
import com.google.android.gms.location.ActivityTransitionEvent;
import com.google.android.gms.location.ActivityTransitionRequest;
import com.google.android.gms.location.ActivityTransitionResult;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;
import java.util.List;

public class ActivityTransitionHelper extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if(ActivityTransitionResult.hasResult(intent)){
            Bglog.i( "Activity transition result received");
            ActivityTransitionResult result = ActivityTransitionResult.extractResult(intent);
            for(ActivityTransitionEvent event: result.getTransitionEvents() ){
                String activityType = event.getTransitionType() == ActivityTransition.ACTIVITY_TRANSITION_ENTER ? "still" : "moving";
                LocationHelper.sendSignalToHeadless(context,"activity_" + activityType);
                Bglog.i( "Transitition event! " + event.toString() );
            }
        }
        else {
            Bglog.i( "Empty activity transition result received");
        }
    }

    public void setListener(Context context){
        Task task = ActivityRecognition.getClient(context)
            .requestActivityTransitionUpdates( buildRequest(), getIntent(context) )
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Bglog.i( "Activity recognizer added properly.");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Bglog.i( "Error adding activity recognizer.");
                        Bglog.e( e.getMessage() );
                    }
                });
    }

    private ActivityTransitionRequest buildRequest() {
        List<ActivityTransition> transitions = new ArrayList<>();
        transitions.add( new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.STILL )
                .setActivityTransition( ActivityTransition.ACTIVITY_TRANSITION_ENTER )
                .build()
        );
        transitions.add( new ActivityTransition.Builder()
                .setActivityType(DetectedActivity.STILL )
                .setActivityTransition( ActivityTransition.ACTIVITY_TRANSITION_EXIT )
                .build()
        );

        return new ActivityTransitionRequest(transitions);
    }

    private PendingIntent mPendingIntent;
    private PendingIntent getIntent( Context context ){
        if( mPendingIntent != null ){
            return mPendingIntent;
        }

        Intent intent = new Intent(context, this.getClass());
        mPendingIntent = PendingIntent.getBroadcast( context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT );
        return mPendingIntent;
    }

}
