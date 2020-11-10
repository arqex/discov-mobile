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
import serverMessageService from '../services/serverMessage/serverMessage.service';
import geofenceService from './geofence.service';
import { log } from '../utils/logger';
import store from '../state/store';

let hasPendingDiscoveries = true;
let lastUpdate = Date.now();
let currentlyInFence = false;
let passiveFence;

export default {
  onLocations: function onLocations( locations, setTrackingMode, source ){
    log(`----- Receiving ${locations.length} location(s)`);

    const classifiedLocations = classifyLocations( locations, source );
    storeService.addLocationReport( classifiedLocations.items );

    this.onLocation( locations[0].coords, setTrackingMode ).then( result => {
      storeService.setLocationResult( classifiedLocations.batchId, result );
    });
  },

  onLocation: function onLocation( location, setTrackingMode, isBackgroundLocation? ){
    log('----- Receiving location');
    // Render location available in the store for the rest of the app
    storeService.addLocationReportOld( location, isBackgroundLocation);
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
    return Promise.resolve({error: 'actions_not_ready'});
  }

  if( !hasAvailableDiscoveries() ){
    console.log('----- Nothing to discover');
    return Promise.resolve({error: 'nothing_to_discover'});
  }

  if( isInGeoFence( passiveFence, location ) ){
    console.log('----- Location in fence');
    return Promise.resolve({error: 'location_in_fence'});
  }

  // From here we have a location out of the fence, we are close to
  // a discovery
  if( !inRequestPause() ){
    log('----- In request pause');
    return Promise.resolve({error: 'in_pause'});
  }
  
  log('----- Getting discoveries!');
  return dataService.getActions().discovery.discoverAround( location )
    .then( res => onDiscoveryResponse( res, location, setTrackingMode ) )
    .then( () => {
      log('----- End location update');
      return {error: false};
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
    createDiscoveriesNofication( res.discoveries );
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
    radius: 50
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

function createDiscoveriesNofication( discoveries ){
  let count = Math.max( discoveries.length, storeService.getUnseenCount() );
  serverMessageService.close();

  const title = count > 1 ?
    __( 'notifications.multipleTitle', {count} ) :
    __( 'notifications.singleTitle')
  ;

  const message = count > 1 ?
    __( 'notifications.multipleMessage', {name: discoveries[0].owner.displayName} ) :
    __( 'notifications.singleMessage', {name: discoveries[0].owner.displayName} )
  ;

  return serverMessageService.open({
    title,
    message,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQanDmDzKGJxRcOsZJjuUwmHGgeKzaOeBaGnA&usqp=CAU'
  });
}


function classifyLocations( locations, source ){
  let batchId = getRandomId();
  let items = [];
  locations.forEach( location => {
    items.push({
      ...location,
      batchId,
      id: getRandomId()
    })
  });

  return { batchId, items };
}

function getRandomId(){
  return '' + Math.random();
}