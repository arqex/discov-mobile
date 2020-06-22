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


const LOCATION_TASK = 'BG_LOCATION';

let currentLoginStatus = isUserLoggedIn() ? 'IN' : 'OUT';
let currentAppStatus: AppStateStatus = AppState.currentState;
let currentTrackingMode: TrackingMode = 'active';

function init(){
  locationService.setTaskName( LOCATION_TASK );
  setTrackingMode( currentTrackingMode );
  addEventListeners();
}
init();

// We need to register the task in the top level context
// so this call can't be within the init function
// The location service is the one how call this task when there is
// a location available.
TaskManager.defineTask( LOCATION_TASK, locationUpdate => {
  console.log('Tracking location');
  if( locationUpdate.error ) return;

  let location = locationUpdate.data.locations[0];
  if( !location ) return;

  locationHandler.onLocation( location.coords, setTrackingMode );
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
          return locationHandler.onLocation( location, setTrackingMode );
        })
      ;
    })
  ;
}

export default {
  setTrackingMode,
  requestPermissions,
  updateCurrentLocation
}