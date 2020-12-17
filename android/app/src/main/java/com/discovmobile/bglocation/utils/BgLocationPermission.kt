package com.discovmobile.bglocation.utils

import com.google.gson.Gson

data class BgLocationPermission(val isGranted: Boolean, val updatedAt: Long, val checkedAt: Long) {
    companion object {
        @JvmStatic
        fun fromString( str: String ): BgLocationPermission{
            return Gson().fromJson(str, BgLocationPermission::class.java)
        }
    }
    fun stringify(): String {
        return Gson().toJson( this );
    }
}