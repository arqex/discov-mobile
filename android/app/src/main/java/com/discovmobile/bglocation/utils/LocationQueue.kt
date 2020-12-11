package com.discovmobile.bglocation.utils

import android.content.Context

private var queue = ArrayList<BgLocation>();
private var initialized = false;

class LocationQueue {
    companion object {
        @JvmStatic
        fun enqueue(context: Context, location: BgLocation) {
            val queue = getQueue(context)
            queue.add( queue.size, location )
            Storage.saveLocationQueue(context, queue)
        }
        @JvmStatic
        fun getFirst(context: Context): BgLocation? {
            val queue = getQueue(context)
            if( queue.size == 0 ) return null
            return queue[0]
        }
        @JvmStatic
        fun getLast(context: Context): BgLocation? {
            val queue = getQueue(context)
            if( queue.size == 0 ) return null
            return queue[queue.size - 1]
        }
        @JvmStatic
        fun pop(context: Context): BgLocation? {
            val queue = getQueue(context)
            if( queue.size == 0 ) return null

            val location = queue[0]
            queue.removeAt(0)
            Storage.saveLocationQueue(context, queue)
            return location
        }

        private fun getQueue( context: Context): ArrayList<BgLocation> {
            if( initialized ) return queue

            initialized = true
            queue = Storage.getLocationQueue(context)

            return queue
        }
    }
}