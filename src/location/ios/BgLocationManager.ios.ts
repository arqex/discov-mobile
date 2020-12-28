import rngl from 'react-native-background-geolocation';

let clbks = [];
let setupPromise = setupRngl();

export default {
  addListener( clbk ){
    clbks.push( clbk );
  },
  removeListener( clbk ){
    let i = clbks.length;
    while( i-- > 0 ){
      if( clbks[i] === clbk ){
        clbks.splice( i, 1 );
      }
    }
  },
  startBackgroundLocationUpdates() {
    setupPromise.then( () => {
      rngl.start( () => console.log('IOS BG LOCATION started') );
    })
  },
  stopBackgroundLocationUpdates() {
    setupPromise.then( () => {
      rngl.stop().then( state => console.log('IOS BG LOCATION stopped', state));
    })
  },
  startTracking(){
    setupPromise.then( () => {
      rngl.watchPosition( rngLocation => {
        handleLocation( rngLocation );
      }, null, {interval: 5000} );
    });
  },
  stopTracking(){
    setupPromise.then( () => {
      rngl.stopWatchPosition();
    })
  },
  updateLocation(){
    return rngl.getCurrentPosition({
      timeout: 20,
      maximumAge: 60000,
      desiredAccuracy: 50,
      samples: 3
    }).then( handleLocation );
  },
	notifyLocationHandled( distanceToDiscovery ){
    // We probably want to stop tracking if we are not close to a discovery
    // but this is not working yet
    console.log('IOS notifyLocationHandled not implemented');
	}
}

function setupRngl(): Promise<void>{
  return new Promise( resolve => {
    rngl.onLocation( rngLocation => {
      handleLocation( rngLocation );
    });
  
    rngl.ready({
      desiredAccuracy: rngl.DESIRED_ACCURACY_HIGH,
      distanceFilter: 30, // We will receive updates when the phone move `distanceFilter` meters
      stationaryRadius: 30, // Meters to move before start the active tracking
      stopTimeout: 4, // Stop tracking after the user is still for `stopTimeout` minutes
      logLevel: rngl.LOG_LEVEL_INFO,
      stopOnTerminate: false,
      startOnBoot: true,
      showsBackgroundLocationIndicator: false
    }, state => {
      console.log('BgLocation.ios configured ', state);
      resolve();
    });
  })
}

function convertLocation( {coords, timestamp, uuid, is_moving} ){
  return {
    accuracy: coords.accuracy,
    altitude: coords.altitude,
    bearing: coords.heading,
    id: uuid,
    latitude: coords.latitude,
    longitude: coords.longitude,
    source: `rngl:${is_moving ? 'MOVING' : 'STILL'}`,
    timestamp: (new Date( timestamp )).getTime()
  }
}

const LOCATION_WAIT = 4000;
let lastLocationTime = 0;
function handleLocation( rngLocation ){
  // We don't want mant locations at the same time, slow them down
  let time = (new Date(rngLocation.timestamp)).getTime();
  if( lastLocationTime + LOCATION_WAIT > time ) return;
  lastLocationTime = time;
  
  clbks.forEach( clbk => {
    clbk( convertLocation( rngLocation ) );
  });
}