package com.discovmobile.bgtasks.utils;

import android.util.Log;

public class Bglog {
    private static String tag = "BgTask";

    public static void i( String msg ){
        Log.i(Bglog.tag, msg);
    }

    public static void w( String msg ){
        Log.w(Bglog.tag, msg);
    }

    public static void e( String msg ){
        Log.e(Bglog.tag, msg);
    }
}
