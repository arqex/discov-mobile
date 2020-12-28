Location tracking on discov
---------------------------

Discov need to watch the location of the phone when it's moving in order to detect when the user enters into the discovery area of a story to reveal it up.

React native app's never access to the phone location directly. Instead, the native side should automatically feed React with locations as soon as the user is moving, so the React app can do what it does better... react to location changes.

But start from the begining...

1. LOCATION STORE
-----------------

The app keeps the location data inside of the main application store, under the `locationData` attribute. This location data has the following structure:

```js
store.locationData = {
  lastTriedAt: 0, // timestamp
  lastLocation: {id, latitude, longitude, timestamp},
  fence: {
    location: {id, latitude, longitude, timestamp},
    distanceToDiscovery: 0
  },
  report: {
    order: [locationId1, locationId2, ...],
    items: { location1, location2, ...}
  },
  foregroundPermission: {isGranted, updatedAt, checkedAt, requestedAt, canAskAgain},
  backgroundPermission: {isGranted, updatedAt, checkedAt, requestedAt}
}
```

2. PERMISSIONS
--------------
To receive locations, the app has to ask for permissions over the phone geolocation, and there are 2 types of permissions:

* Location permission for when the app is in the foreground.
* Location permission for when the app is in the background.

Discov needs both permissions, and especially the background one because the discoveries will happen the the user is moving, and probably would have the device in standby.

In the latest versions of Android and iOS, initially the apps can only request the location permission for when the app is being used (in foreground), and once that permission is granted, it can ask for the background one.

The React app can't never know in realtime if it has permissions to get the location in the background, because react is always run in the foreground. It's native side's duty to detect in the background if the permission is granted.

When the React app goes into the foreground, it requests to update the information about both permissions, and the latest data will be found in the location store in the variables `foregroundPermission` and `backgroundPermission`. If the permissions has been never requested to the user, both attributes might be `null`.

Both objects are similar, but the `foregroundPermission` one has the attribute `canAskAgain`, that informs React if it can ask for the foreground permission again. Once the user has denied the permission once, `canAskAgain` might be `false`, and even if we try programmatically to request the permission again, the OS will refuse to show the request dialog to the user. In that case, the only way of granting the permission again is going to the phone settings to edit the app permission there.

When getting into the foreground, both permission data are updated, if the foreground permission is granted but the background one is not, it's the time to request the user for granting it.

If the user reject the background permission, we should wait at least a couple of hours to ask for it again to not overwhelm the user and feel the app is needy.

On the otherhand, we should request that the user grant the foreground permission any time that they try to complete any action related with the location. Like creating a new story or search by location.

3. RECEIVING LOCATIONS
---------------------- 
React app can't request the current location directly, but it will have access to the latest known location by reading `locationData.lastLocation`.

When the user is moving, the native side will send new locations to the React side, and `locationData.lastLocation` will be updated.

What the React app is able to do, it's request the native side to update the location at any moment, or even ask the server to actively start tracking the device location using the GPS that will update the location frequently. This way the app can show the location of the device in the app at real time.