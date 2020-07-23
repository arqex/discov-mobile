// The tracker is the responsible of managing when to start/stop
// the location updates, and how often we need the location updates
// these locations are received from the service and they are passed
// to the handler

import { AppState } from 'react-native';
import locationService from './location.service';
import locationHandler from './location.handler';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import * as TaskManager from 'expo-task-manager';
import geofenceService from './geofence.service';
import backgroundFetch from './backgroundFetch.service';
import store from '../state/store';
import { log } from '../utils/logger';
// import geolocation from '@react-native-community/geolocation';

const LOCATION_TASK = 'DISCOV_LOCATION';
const GEOFENCING_TASK = 'DISCOV_GEOFENCE';

// We need to register the task in the top level context
// so this call can't be within the init function
// The location service is the one how call this task when there is
// a location available.
TaskManager.defineTask(LOCATION_TASK, locationUpdate => {
  console.log('Tracking location');
  if (locationUpdate.error) return console.log(locationUpdate.error);

  let locations = locationUpdate.data.locations;
  console.log(`**** ${locations.length} NEW LOCATIONS`);

  let location = locations[0];
  if (!location) return;

  locationHandler.onLocation(location.coords, setTrackingMode);
});

// We need also to register the geofence task
let exiting = false;
let exitingTimer: any = false;
TaskManager.defineTask(GEOFENCING_TASK, event => {
  console.log('Geofence event', event.data);
  if (event.error) return console.warn(event.error);

  if (geofenceService.isExitEvent(event)) {
    console.log('An exit event');
    exiting = true;
    if (exitingTimer) {
      clearTimeout(exitingTimer);
    }
    setTimeout(() => {
      exitingTimer = false;
      if (exiting) {
        exiting = false;
        console.log('destroying geofence');
        locationHandler.resetFence();
        setTrackingMode('active');
      }
    }, 2000);
  }
  else {
    console.log('Not an exit event');
    // Cancel the exit if were exiting
    exiting = false;
  }
});

locationService.setTaskName(LOCATION_TASK);
geofenceService.setTaskName(GEOFENCING_TASK);

function start() {
  console.log('Starting backgound services');
  isLocationReady().then( isReady => {
    if( isReady ){
      console.log('Location track start: OK');
      backgroundFetch.init( onBgFetchEvent );
      setTrackingMode('passive');
    }
    else {
      let permissions = dataService.getStore().locationPermissions;
      console.log('Location track start: NOT READY. Setting active mode', permissions);
      locationService.setLocationMode('active', false);
    }
  });
}
// Try to start now
start();

function stop() {

}

let lastAppStatus = AppState.currentState;

type TrackingMode = 'active' | 'passive';
function setTrackingMode( mode:TrackingMode ){
  return isLocationReady()
    .then( isReady => {
      // Not having the permissions will make no change
      // if( !isReady ) return;

      return locationService.setLocationMode( mode, isInForeground() );
    })
  ;
}

function isLocationReady() {
  return dataService.init().then( () => {
    if (!isUserLoggedIn()) return false;

    return waitForBgTask().then( () => {
      // We don't check real permissions here, because in
      // the background task might not be granted
      // If we had stored a position before, we are ok to continue
      return storeService.getCurrentPosition().status === 'ok';
    });
  });
}

// If we are booting the app, there is a chance that the task is
// still being registered
function waitForBgTask() {
  return TaskManager.isTaskRegisteredAsync( LOCATION_TASK )
    .then( isRegistered => {
      if( !isRegistered ){
        // If it's not registered wait a bit more
        return new Promise( resolve => setTimeout( resolve, 2000 ) );
      }
    })
  ;
}

function isPermissionGranted(){
  return locationService.getPermissions()
    .then( permissions => {
      storeService.setLocationPermissions( permissions );
      return permissions.granted;
    })
  ;
}

function isInForeground(){
  return AppState.currentState === 'active';
}

function isUserLoggedIn(){
  let apiClient = dataService.getApiClient();
  return apiClient.getAuthStatus() === 'IN';
}

function addEventListeners(){
  // This will activate/deactivate the foreground notification
  // if needed, when the app goes in background/foreground
  AppState.addEventListener('change', status => {
    console.log('---- APP GOES TO ' + (status === 'active' ? 'FOREGROUND' : 'BACKGROUND') );

    if( status === lastAppStatus || status === 'inactive' ) return;

    lastAppStatus = status;

    let inFence = storeService.getFenceDistance() >= 0;
    if( status === 'active' || inFence ){
      setTrackingMode('passive');
    }
    else {
      setTrackingMode('active');
    }
  });
}
addEventListeners();

function requestPermissions(){
  return locationService.requestPermissions()
    .then( permissions => {
      storeService.setLocationPermissions(permissions);
      return permissions;
    })
  ;
}

function updateCurrentLocation(){
  return isLocationReady()
    .then( isReady => {
      // Not having the permissions will make no change
      if( !isReady ) return;

      return locationService.getCurrentLocation()
        .then( location => {
          return locationHandler.onLocation( location.coords, setTrackingMode );
        })
      ;
    })
  ;
}

function bgLog( str ){
  log(`$$$ BG ${str}`);
  storeService.addBGReport( str );
}

let bgFetchPromise: any; 
async function onBgFetchEvent() {
  bgLog('fetch event');

  return dataService.init().then( () => {
    let apiClient = dataService.getApiClient();

    // We use the api status instead of the dataService's one
    // because we just need the client to be authenticated
    // not the account data to be loaded
    if( apiClient.getAuthStatus() !== 'IN' ){
      return bgLog('User not logged in');
    }

    storeService.addLocationReport({
      latitude: 0,
      longitude: 0,
      accuracy: 0
    }, true);

    bgLog('User is in place');

    if( AppState.currentState === 'background' ){
      bgLog('setting it into active mode');
      locationService.triggerForegroundLocation();
    }
  });
}

function onBgFetchEventOld(){
  // return Promise.resolve( bgLog('fetch event') );

  
  
  bgLog('fetch event') 
  if (bgFetchPromise) {
    bgLog('promise already pending')
    return bgFetchPromise;
  }

  bgFetchPromise = dataService.init().then( () => {
    if ( !isUserLoggedIn() ) {
      bgLog('user NOT logged in');
      return Promise.resolve(false);
    }

    bgLog('user logged in');

    bgLog('fetch event is being handled');

    return isPermissionGranted()
      .then(isGranted => {
        // if( !isGranted ) return console.log('$$$ Location permission not granted');;
        bgLog('fetch getting last location');
        return locationService.getLastLocation()
          .then(location => {
            if (location) {
              bgLog('location received');
              locationHandler.onLocation(location.coords, setTrackingMode, true);
            }
            else {
              bgLog('No location reveived');
            }
          })
        ;
      })
      .catch(err => {
        locationService.setLocationMode( 'active', false )
        if( err.code === 'E_LOCATION_UNAUTHORIZED' ){
          bgLog('Location unauthorized. Triggering fg location');
          locationService.triggerForegroundLocation();
          /*
          return geolocation.getCurrentPosition(
            position => {
              // setTrackingMode('passive');
              console.log( position );
            },
            error => {
              // setTrackingMode('passive');
              console.log( error );
            }
          );
          */
        }
        else {
          bgLog(err);
        }
      })
    ; 
  })
  .catch( err => {
    bgLog('Error initializing data');
    console.log( err );
  })
  .finally(() => {
    bgFetchPromise = false;
  });

  return bgFetchPromise;
}

export default {
  setTrackingMode,
  requestPermissions,
  updateCurrentLocation,
  isPermissionGranted
}