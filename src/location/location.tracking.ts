// The tracker is the responsible of managing when to start/stop
// the location updates, and how often we need the location updates
// these locations are received from the service and they are passed
// to the handler

import { AppState, AppStateStatus } from 'react-native';
import locationService from './location.service';
import locationHandler from './location.handler';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import * as TaskManager from 'expo-task-manager';
import geofenceService from './geofence.service';
import backgroundFetch from './backgroundFetch.service';


const LOCATION_TASK = 'DISCOV_LOCATION';
const GEOFENCING_TASK = 'DISCOV_GEOFENCE';

let currentLoginStatus = isUserLoggedIn() ? 'IN' : 'OUT';
let currentAppStatus: AppStateStatus = AppState.currentState;
let currentTrackingMode: TrackingMode = 'active';

function init(){
  console.log('HEeEEEEETEY INIT!');
  locationService.setTaskName( LOCATION_TASK );
  geofenceService.setTaskName( GEOFENCING_TASK );
  setTrackingMode(currentTrackingMode);
  console.log('HEeEEEEETEY INIT!');
  backgroundFetch.init(onBgFetchEvent);
  console.log('HEeEEEEETEY INIT!');
  addEventListeners();
}
init();

// We need to register the task in the top level context
// so this call can't be within the init function
// The location service is the one how call this task when there is
// a location available.
TaskManager.defineTask( LOCATION_TASK, locationUpdate => {
  console.log('Tracking location');
  if( locationUpdate.error ) return console.log( locationUpdate.error );

  let locations = locationUpdate.data.locations;
  console.log(`**** ${locations.length} NEW LOCATIONS` );

  let location = locations[0];
  if( !location ) return;

  locationHandler.onLocation( location.coords, setTrackingMode );
});

// We need also to register the geofence task
let exiting = false;
let exitingTimer:any = false;
TaskManager.defineTask( GEOFENCING_TASK, event => {
  console.log('Geofence event', event.data);
  if( event.error ) return console.warn( event.error );

  if( geofenceService.isExitEvent( event ) ){
    console.log('An exit event');
    exiting = true;
    if( exitingTimer ){
      clearTimeout( exitingTimer );
    }
    setTimeout( () => {
      exitingTimer = false;
      if( exiting ){
        exiting = false;
        console.log('destroying geofence');
        locationHandler.resetFence();
        setTrackingMode('active');
      }
    }, 2000 );
  }
  else {
    console.log('Not an exit event');
    // Cancel the exit if were exiting
    exiting = false;
  }
}); 


type TrackingMode = 'active' | 'passive';
function setTrackingMode( mode:TrackingMode ){
  currentTrackingMode = mode;
  
  return isLocationReady()
    .then( isReady => {
      // Not having the permissions will make no change
      if( !isReady ) return;

      return locationService.setLocationMode( mode, isInForeground() );
    })
  ;
}

function isLocationReady() {
  if( !isUserLoggedIn() ) return Promise.resolve(false);

  let promises = [
    waitForBgTask(),
    isPermissionGranted()
  ];
  
  return Promise.all( promises ) 
    .then( results => {
      let permissionGranted = results[1];
      return permissionGranted;
    })
  ;
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
  // Logged in and with the account ready
  if( dataService.getStatus() !== 'IN') return false;
  return !!dataService.getStore().user.account;
}

function addEventListeners(){
  // This will start/stop tracking when the user logs in/out
  dataService.addStatusListener( status => {
    if( status === currentLoginStatus ) return;
    currentLoginStatus = status;

    if( status === 'IN' ){
      setTrackingMode( currentTrackingMode );
    } 
    else {
      locationHandler.resetFence();
      locationService.stopTracking();
    }
  });

  // This will activate/deactivate the foreground notification
  // if needed, when the app goes in background/foreground
  AppState.addEventListener('change', status => {
    console.log('---- APP GOES TO ' + (status === 'active' ? 'FOREGROUND' : 'BACKGROUND') );

    if( status === currentAppStatus ) return;
    currentAppStatus = status;

    setTrackingMode( currentTrackingMode );
  });
}

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

function onBgFetchEvent(){
  console.log('$$$ BG fetch event');

  return locationService.getLastLocation()
    .then( location => {
      if (location) {
        console.log('$$$ BG location received');
        storeService.addLocationReport( location, true );
        locationHandler.onLocation(location.coords, setTrackingMode);
      }
    })
    .catch( err => {
      console.log('$$$ BG location error');
      console.error( err );
    })
  ;
}

export default {
  setTrackingMode,
  requestPermissions,
  updateCurrentLocation
}