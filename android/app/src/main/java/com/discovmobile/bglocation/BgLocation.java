package com.discovmobile.bglocation;

import android.location.Location;

public class BgLocation {
    public double altitude;
    public double bearing;
    public double accuracy;
    public double latitude;
    public double longitude;
    public double speed;
    public float timestamp;

    public BgLocation( Location location ){
        altitude = location.getAltitude();
        bearing = location.getBearing();
        accuracy = location.getAccuracy();
        latitude = location.getLatitude();
        longitude = location.getLongitude();
        speed = location.getSpeed();
        timestamp = location.getTime();
    }
}
