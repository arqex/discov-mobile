package com.discovmobile.bglocation.utils;

import android.location.Location;

import com.google.gson.Gson;

import javax.annotation.Nullable;

public class BgLocation {
    public double altitude;
    public double bearing;
    public double accuracy;
    public double latitude;
    public double longitude;
    public double speed;
    public float timestamp;
    public String source;

    public BgLocation(Location location, @Nullable String src ){
        altitude = location.getAltitude();
        bearing = location.getBearing();
        accuracy = location.getAccuracy();
        latitude = location.getLatitude();
        longitude = location.getLongitude();
        speed = location.getSpeed();
        timestamp = location.getTime();
        if( src == null ){
            source = "";
        }
        else {
            source = src;
        }
    }

    public String stringify(){
        return (new Gson()).toJson( this );
    }

    public static BgLocation fromString(String strigified ){
        return (new Gson()).fromJson( strigified, BgLocation.class );
    }
}
