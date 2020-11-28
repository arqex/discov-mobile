package com.discovmobile.bgtasks;

import android.util.Log;

public class Bglog {
    private static String tag = "BgTask";

    static void i( String msg ){
        Log.i(Bglog.tag, msg);
    }

    static void w( String msg ){
        Log.w(Bglog.tag, msg);
    }

    static void e( String msg ){
        Log.e(Bglog.tag, msg);
    }
}
