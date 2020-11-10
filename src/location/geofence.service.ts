
import * as Location from 'expo-location';

let GEOFENCE_TASK: string;
function setTaskName( name ){
  GEOFENCE_TASK = name;
}

function isStarted() {
  return Location.hasStartedGeofencingAsync( GEOFENCE_TASK );
}

function validateCircle( circle ){
  if( !circle ) return false;
  let {latitude, longitude, radius} = circle;

  return !isNaN(latitude) && !isNaN(longitude) && !isNaN(radius);
}

function addStaleRegion( circle ){
  if( !validateCircle( circle ) ){
    console.warn('Not valid circle adding a geofence');
  }


  const regions = [{
    id: 'staleRegion',
    latitude: circle.latitude,
    longitude: circle.longitude,
    radius: circle.radius
  }];
  console.log('Creating geofence', regions[0]);

  return Location.startGeofencingAsync( GEOFENCE_TASK, regions )
    .then( res => {
      console.log('Geofence created ok', res);
    })
  ;
}

let stoppingPromise
function removeStaleRegion(){
  if( stoppingPromise ) return stoppingPromise;

  // ATM we only use one region, so removing it is stopping geofencing
  stoppingPromise = Location.stopGeofencingAsync( GEOFENCE_TASK )
    .then( () => stoppingPromise = false )
    .catch( err => {
      // Probably geofencing was already stopped
      stoppingPromise = false
    })
  ;

  return stoppingPromise;
}

function isExitEvent( event ){
  return event.data.eventType === Location.GeofencingEventType.Exit;
}

export default {
  setTaskName,
  isStarted,
  addStaleRegion,
  removeStaleRegion,
  isExitEvent
}