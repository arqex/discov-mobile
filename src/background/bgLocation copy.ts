import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { dataService } from '../services/data.service';
import storeService from '../state/store.service';
import { actions } from '../state/appState';
import notifications from '../utils/notifications';
import { getDistance } from '../utils/maps';

const TRACK_LOCATION = 'BG_LOCATION';

let startingPromise, stoppingPromise;

TaskManager.unregisterAllTasksAsync()
  .then( () => console.log('All tasks unregistered') )
  .catch( err => {
    console.log('Error unregistering tasks')
    console.error( err );
  })
;

const bgTracking = {
	start: function(){
    if( startingPromise ) return startingPromise;
    
    return startingPromise = this.isStarted()
      .then( isStarted => {
        startingPromise = false;
        console.log('BG Locations STATUS - isStarted', isStarted);
        
        if ( isStarted ) {
          return console.log('Already running');
        }

        return checkPermission();
      })
      .then( permissionGranted => {
        if( permissionGranted ){
          const options = {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 20,
            foregroundService: {
              notificationTitle: 'A new story is nearby!',
              notificationBody: 'Geo location is now active to notify when you discover it.'
            }
          }
          
          return waitForTask()
            .then( () => Location.startLocationUpdatesAsync(TRACK_LOCATION, options) )
            .then( () => {
              console.log('Location task registered');
            })
          ;
        }
      })
      .catch( err => {
        console.log('Error registering task')
        console.error( err );
      })
    ;
  },
  isStarted() {
    return Location.hasStartedLocationUpdatesAsync(TRACK_LOCATION);
  },
  stop() {
    console.log('gbTracking stop called')

    if( stoppingPromise ) return stoppingPromise;

    console.log('gbTracking try to stop')

    
    return stoppingPromise = this.isStarted().then( isStarted => {
			startingPromise = false;
      if ( !isStarted ) {
				return console.log('Already stopped');
      }

      console.log('gbTracking stopping');
      return Location.stopLocationUpdatesAsync( TRACK_LOCATION );
    });
  }
}

// Start the tracking up
if (readyForTracking()) {
  bgTracking.start();
}
// Handle login changes
dataService.addStatusListener( status => {
	if ( readyForTracking() ) {
		bgTracking.start();
	}
	else if (status === 'OUT') {
		bgTracking.stop();
	}
});

export default bgTracking;


TaskManager.defineTask( TRACK_LOCATION, locationUpdate => {
  console.log('Tracking location');
  if( locationUpdate.error ) return;

  let location = locationUpdate.data.locations[0];
  console.log( 'Location update', location );

  if( !location ) return;

  storeService.addLocationReport( location.coords );

  updateLocation( location.coords );
});

function waitForTask(){
  return TaskManager.isTaskRegisteredAsync( TRACK_LOCATION )
    .then( isRegistered => {
      if( !isRegistered ){
        // If it's not registered wait a bit more
        return new Promise( resolve => setTimeout( resolve, 2000 ) );
      }
    })
  ;
}

export function updateLocation( location ){
  let lastLocation = storeService.getCurrentPosition();
  let fence = storeService.getPassiveGeofence();

  // console.log( 'last location', lastLocation );
  // console.log( 'location', location );
  let movement = lastLocation && lastLocation.coords && getDistance( location, lastLocation.coords );
  let isMoving = movement && movement > 20;
  let isInFence = isInGeoFence( location, fence );

  console.log('Location received', location);

  if( !isInFence && areActionsReady() ){
    discoverAround( location )
      .then( res => {
        storeService.storePassiveGeoFence( location, res.closestDiscoveryDistance );        
        return res;
      })
    ;
  }
  else {
    console.log('DA: Location in fence');
  }

  storeService.storeCurrentPosition( location );
}

function isInGeoFence( location, fence ){
  if( !location || !fence ) return;
  let distance = getDistance( location, fence );
  console.log('Distance to get out of the fence', fence.radius - distance);
  return distance < fence.radius;
}

// discoverAround has a buffer of 1 minute
const BUFFER_TIME = 60000;
let lastDiscoverResponse;
let bufferLocation;
let bufferTimer;
function discoverAround( location ){
  if( !bufferLocation ){
    bufferLocation = location;
    console.log('DA: Calling discover around');
    lastDiscoverResponse = actions.discovery.discoverAround( location )
      .then( res => {
        if (res && res.discoveries && res.discoveries.length ){
          notifications.createDiscoveriesNofication( res.discoveries );
        }

        setTimeout( () => {
          if( !bufferTimer ){
            bufferLocation = false;
          }
        }, BUFFER_TIME);
  
        return res;
      })
    ;
    return lastDiscoverResponse;
  }
  else {
    console.log('DA: Buffering location');
    bufferLocation = location;
    clearTimeout( bufferTimer );
    bufferTimer = setTimeout( () => {
      let location = bufferLocation;
      bufferLocation = false;
      bufferTimer = false;
      discoverAround( location );
    }, BUFFER_TIME);
    return lastDiscoverResponse;
  }
}

function checkPermission() {
  return Location.getPermissionsAsync()
    .then( permissions => {
      if( !permissions.granted && permissions.canAskAgain ){
        // return Location.requestPermissionsAsync();
      }
      return permissions;
    })
    .then( permissions => {
      console.log( permissions );
      if( permissions.granted ){
        console.log('Permission granted');
      }
      else {
        console.log('Permission NOT granted');
      }

      storeService.setLocationPermissions( permissions );
      return permissions.granted;
    })
    .catch( err => {
      console.error( err );
      return false;
    })
  ;
}

function areActionsReady(){
  return actions && actions.discovery;
}

// To start tracking we need to be logged in and having
// an account ready
function readyForTracking() {
  if( dataService.getStatus() !== 'IN') return false;
  const store = dataService.getStore();

  if( !store.user.account ) return false;

  if( !store.locationPermissions || !store.locationPermissions.granted ) return false;

  return true;
}