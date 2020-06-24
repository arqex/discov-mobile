// The service is the responsible of start/stop the
// location updates from the phone. These location updates
// will be configured by, and provided to, the location tracker.

import * as Location from 'expo-location';

let LOCATION_TASK: string;
function setTaskName( name ){
  LOCATION_TASK = name;
}

function isStarted() {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
}


// With startWithOptions we can change the options of the location task on the fly
let startingData: any;
function startWithOptions( options ){
  let serializedOptions = JSON.stringify(options);
  if( startingData && startingData.options === serializedOptions ){
    return startingData.promise;
  }
  else {
    startingData = false;
  }

  let promise = isStarted()
    .then( isStarted => {
      return isStarted && Location.stopLocationUpdatesAsync(LOCATION_TASK)
    })
    .then( () => {
      return Location.startLocationUpdatesAsync(LOCATION_TASK, options)
    })
    .then( () => {
      startingData = false;
      console.log('Location task refreshed');
    })
  ;

  startingData = {
    options: serializedOptions,
    promise
  };

  return promise;
}

let stopPromise: any;
function stopTracking() {
  if( stopPromise ){
    return stopPromise;
  }

  return stopPromise = isStarted().then( isStarted => {
    if ( !isStarted ) {
      stopPromise = false;
      return console.log('Location tracking already stopped');
    }

    console.log('Stopping location tracking...');
    return Location.stopLocationUpdatesAsync( LOCATION_TASK )
      .then( () => {
        stopPromise = false;
        return console.log('Location tracking stopped');
      })
    ;
  })
}

function getPermissions() {
  return Location.getPermissionsAsync();
}

function getCurrentLocation() {
  return Location.getCurrentPositionAsync();
}

// There will be 2 modes:
// * active - when we are around a discovery or when we are showing a map
// * passive - when there are no discoveries around and we are showing no map
// The active mode when the app is in the background needs the
// foreground service notification to receive the updates frequently
type LocationTrackMode = 'active' | 'passive';
let trackMode: LocationTrackMode;
let trackingInForeground: boolean;
function setLocationMode( mode: LocationTrackMode, inForeground: boolean ){
  if( mode === trackMode && trackingInForeground === inForeground ){
    return console.log(`Location tracking already in mode ${mode}, ${inForeground ? 'in foreground' : 'in background'}`);
  }

  console.log('Setting location mode', mode, inForeground ? 'foreground' : 'background');

  trackMode = mode;
  trackingInForeground = inForeground;

  let options: any = {
    accuracy: Location.Accuracy.High, // mode === 'active' ? Location.Accuracy.High : Location.Accuracy.Balanced,
    // timeInterval: 5000,
    // distanceInterval: 20
  };

  if( mode === 'active' && !inForeground ){
    options.foregroundService = {
      notificationTitle: 'A new story is nearby!',
      notificationBody: 'Geo location is now active to notify when you discover it.'
    }
  }

  return startWithOptions( options );
}

function requestPermissions() {
  return Location.requestPermissionsAsync();
}


export default {
  setTaskName,
  isStarted,
  startWithOptions,
  stopTracking,
  setLocationMode,
  getPermissions,
  requestPermissions,
  getCurrentLocation
}