import * as TaskManager from 'expo-task-manager';
import storeService from '../state/store.service';
import { actions } from '../state/appState';
import notifications from '../utils/notifications';
import trackingHandler from './trackingHandler';
import { getDistance } from '../utils/maps';

export const taskIds = {
  PASSIVE: 'PASSIVE_TRACKING',
  ACTIVE: 'ACTIVE_TRACKING',
  TIMER: 'TIMER_TRACKING'
};

export function updateLocation( location ){
  let lastLocation = storeService.getCurrentPosition();
  let fence = storeService.getPassiveGeofence();

  console.log( 'last location', lastLocation );
  console.log( 'location', location );
  let movement = lastLocation && getDistance( location, lastLocation.coords );
  let isMoving = movement && movement > 20;
  let isInFence = isInGeoFence( location, fence );

  console.log('Location received', location);

  if( !isInFence ){
    console.log('Getting discoveries...');
    discoverAround( location )
      .then( res => {
        storeService.storePassiveGeoFence( location, res.closestDiscoveryDistance );        
        return res;
      })
    ;
  }
  else {
    console.log('Location in fence');
  }

  storeService.storeCurrentPosition( location );

  trackingHandler.onMovingChange( isMoving );
  trackingHandler.onDiscoverArea( !isInFence );
}

function isInGeoFence( location, fence ){
  if( !location || !fence ) return;
  let distance = getDistance( location, fence );

  console.log('Fence distance and radius', distance, fence.radius);
  return distance < fence.radius;
}


function discoverAround( location ){
  return actions.discovery.discoverAround( location )
    .then( res => {
      if (res && res.discoveries && res.discoveries.length ){
        notifications.create('new_discoveries', res.discoveries );
      }

      return res;
    })
  ;
}


console.log('Registering active tracking task');
TaskManager.defineTask( taskIds.ACTIVE, locationUpdate => {
  let location = getLocationFromUpdate( locationUpdate );
  if( location ){
    console.log('Updating location from active');
    updateLocation( location );
  }
});

console.log('Registering passive tracking task');
TaskManager.defineTask( taskIds.PASSIVE, locationUpdate => {
  let location = getLocationFromUpdate( locationUpdate );
  if( location ){
    console.log('Updating location from passive');
    updateLocation( location );
  }
});

function getLocationFromUpdate( locationUpdate ){
  if( locationUpdate.error ) return;

  let location = locationUpdate.data.locations[0];
  console.log( 'Location update', location );

  if( !location ) return;

  return location.coords;
}