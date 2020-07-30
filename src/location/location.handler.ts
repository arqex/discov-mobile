/**
 * We'll have 2 fences:
 *  - The native geofence that we call "geoFence", that will wake up our app when we exit from it
 *    so we can request a new location at that point
 *  - The "passiveFence" that we control. We will continue receiving locations even when we are in
 *    the geoFence, so we will keep track of those positions and set the active mode if we get out of the
 *    passiveFence.
 */

import { getDistance } from '../utils/maps';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import notifications from '../utils/notifications';
import geofenceService from './geofence.service';
import { log } from '../utils/logger';

let hasPendingDiscoveries = true;
let lastUpdate = Date.now();
let currentlyInFence = false;
let passiveFence;

export default {
  onLocation: function onLocation( location, setTrackingMode, isBackgroundLocation? ){
    log('----- Receiving location');
    // Render location available in the store for the rest of the app
    storeService.addLocationReport( location, isBackgroundLocation);
    storeService.storeCurrentPosition( location );

    // Check if we have new discoveries
    let apiClient = dataService.getApiClient();
    if (apiClient && apiClient.getAuthStatus() === 'IN') {
      checkDiscoveries(location, setTrackingMode);
    }
    else {
      console.log('----- API client not authenticated on location');
    }
  },

  resetFence(){
    destroyFences();
  },

  getFenceData() {
    return {
      passiveFence: passiveFence,
      distanceFromOutOfFence: storeService.getFenceDistance()
    };
  }

}

function checkDiscoveries( location, setTrackingMode ){
  console.log('Location received');

  if( !dataService.getActions() ){
    console.log('----- Actions not ready yet');
    return Promise.resolve( false );
  }

  if( !hasAvailableDiscoveries() ){
    console.log('----- Nothing to discover');
    return Promise.resolve( false );
  }

  if( isInGeoFence( passiveFence, location ) ){
    console.log('----- Location in fence');
    return Promise.resolve( false );
  }

  // From here we have a location out of the fence, we are close to
  // a discovery
  if( !inRequestPause() ){
    log('----- In request pause');
    return Promise.resolve( false );
  }
  
  log('----- Getting discoveries!');

  return dataService.getActions().discovery.discoverAround( location )
    .then( res => onDiscoveryResponse( res, location, setTrackingMode ) )
    .then( () => {
      console.log('----- End location update');
    })
  ;
}

const STALE_UPDATE_TIME = 5 * 60 * 1000;
function hasAvailableDiscoveries(){
  return hasPendingDiscoveries || (Date.now() - lastUpdate) > STALE_UPDATE_TIME;
}

const ACTIVE_RADIUS = 200;
function onDiscoveryResponse( res, location, setTrackingMode ){
  console.log('On discovery response');

  
  if( !res || !res.discoveries ) return;

  // Notify new discoveries 
  if( res.discoveries && res.discoveries.length ){
    log('New discoveries: ' + res.discoveries.length);
    notifications.createDiscoveriesNofication( res.discoveries );
  }
  else {
    log('No new discoveries');
  }

  const distanceToDiscovery = res.closestDiscoveryDistance;

  hasPendingDiscoveries = distanceToDiscovery !== -1;
  lastUpdate = Date.now();

  if( !hasPendingDiscoveries ){
    // No discoveries around
    storeService.storeFenceDistance(0);
    setTrackingMode('passive');
    return destroyFences();
  }

  const inFence = distanceToDiscovery > ACTIVE_RADIUS;
  if( inFence !== currentlyInFence ){
    console.log('Fence change!', inFence ? 'In the fence' : 'Out the fence');
    currentlyInFence = inFence;
    setTrackingMode( inFence ? 'passive' : 'active' );
  }
  else {
    console.log('Fence the same');
  }

  updateFences( location, distanceToDiscovery - ACTIVE_RADIUS );
}

// Five seconds without requesting new discoveries
const REQUEST_PAUSE = 5000;
let lastRequested;
function inRequestPause() {
  let now = Date.now();
  if( !lastRequested || now - lastRequested > REQUEST_PAUSE ){
    lastRequested = now;
    return true;
  }
  return false;
}

function updateFences( location, radius ){
  console.log('updateFences', radius);
  
  storeService.storeFenceDistance( radius );

  if( radius <= 0 ){
    // We are out of the fences
    return destroyFences();
  }

  const candidateFence = {
    latitude: location.latitude,
    longitude: location.longitude,
    lastUpdated: new Date(),
    radius
  };

  // We create a new fence if there isn't a current one
  // or if the current one doesn't contain the new fence
  if( !passiveFence || !fenceContainsFence( passiveFence, candidateFence ) ){
    createFences( candidateFence );
  };
}

function fenceContainsFence( container, fence ){
  let centerDistance = getDistance( container, fence );
  return container.radius - centerDistance - fence.radius > 0;
}

function destroyFences(){
  console.log( 'Destroying fences');
  passiveFence = false;
  geofenceService.removeStaleRegion();
}

function createFences( circle ){
  passiveFence = circle;
  geofenceService.addStaleRegion( circle );
}

// Two hours and the fence is not valid anymore
const FENCE_EXPIRY = 2 * 60 * 60 * 1000;
function isInGeoFence( fence, location ){
  console.log('Current fence', fence);
  if( !fence ) return false;

  if( Date.now() - fence.lastUpdated > FENCE_EXPIRY ){
    console.log('fence expired');
    fence = false;
    return false;
  }

  if( fence.radius === -1 ){
    // If there are no discoveries to do, it's like being in the fence
    return true;
  }

  let distance = getDistance( location, fence );
  return distance < fence.radius;
}