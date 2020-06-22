import { getDistance } from '../utils/maps';
import storeService from '../state/store.service';
import { actions } from '../state/appState';
import notifications from '../utils/notifications';

let currentlyInFence = false;
let fence;

export default {
  onLocation: function onLocation( location, setTrackingMode ){
    
    // Render location available in the store for the rest of the app
    storeService.addLocationReport( location );
    storeService.storeCurrentPosition( location );

    // Check if we have new discoveries
    checkDiscoveries( location )
      .then( inFence => {
        console.log('In fence?', inFence);
        if( inFence === currentlyInFence ) return;

        currentlyInFence = inFence;
        setTrackingMode( inFence ? 'passive' : 'active' );
      })
    ;
  }
}

// checkDiscoveries has a buffer of 30 secs
// to not to saturate the endpoint with calls with close locations
const BUFFER_TIME = 30000;
const OUT_FENCE_RADIUS = 200; // 200m around of a discovery we are not in the fence
let bufferLocation;
let bufferTimer;
function checkDiscoveries( location ){
  console.log('Location received');
  
  if( isInGeoFence( location ) ){
    console.log('Location in fence');
    return Promise.resolve( true );
  }

  // From here we have a location out of the fence, we are close to
  // a discovery
  if( bufferLocation ){
    console.log('Buffering location');
    bufferLocation = location;
    return Promise.resolve( false );
  }

  console.log('Getting discoveries!')
  // Setting the buffer location we prevent asking for discoveries
  // in the next minute
  bufferLocation = location;

  return actions.discovery.discoverAround( location )
    .then( res => {
      saveFence( location, res.closestDiscoveryDistance );

      if( res.discoveries && res.discoveries.length ){
        notifications.createDiscoveriesNofication( res.discoveries );
      }

      startLocationTimer( location );

      return isInGeoFence( location );
    })
  ;
}

function startLocationTimer( lastLocation ){
  setTimeout( () => {
    let location = bufferLocation;
    bufferLocation = false;
    if( location !== lastLocation ){
      checkDiscoveries( location );
    }
  }, BUFFER_TIME);
}

function setLocationBuffer( location ){
  bufferLocation = location;
  clearTimeout( bufferTimer );
  bufferTimer = setTimeout( () => {
    let location = bufferLocation;
    bufferLocation = false;
    bufferTimer = false;
    checkDiscoveries( location );
  }, BUFFER_TIME);
}

// Two hours and the fence is not valid anymore
const FENCE_EXPIRY = 2 * 60 * 60 * 1000;
function isInGeoFence( location ){
  console.log('Current fence', fence);
  if( !fence ) return false;

  if( Date.now() - fence.lastUpdated > FENCE_EXPIRY ){
    console.log('fence expired');
    fence = false;
    return false;
  }

  let distance = getDistance( location, fence.coords );
  return distance < fence.distance;
}

function saveFence( location, distance ){
  if( distance !== -1 && distance < OUT_FENCE_RADIUS ){
    // We are close to a discovery, out of fence
    fence = false;
  }
  else {
    fence = {
      lastUpdated: Date.now(),
      distance,
      coords: location
    }
  }
}