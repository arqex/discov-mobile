import {NativeModules} from 'react-native';

export default {
  setDistanceToDiscovery( distance ) {
    NativeModules.BgLocation.setDistanceToDiscovery( distance );
  },
  startTracking(){
    NativeModules.BgLocation.startForegroundTracking();
  },
  stopTracking(){
    NativeModules.BgLocation.stopForegroundTracking();
  },
  updateLocation( force = false ){
    NativeModules.BgLocation.updateLocation(force);
  },
  startBackgroundLocationUpdates(){
    NativeModules.BgLocation.startBackgroundLocationUpdates();
  },
  stopBackgroundLocationUpdates(){
    NativeModules.BgLocation.stopBackgroundLocationUpdates();
  },
  getBackgroundLocationPermission(){
    return NativeModules.BgLocation.getBackgroundLocationPermission()
      .then( permisionStr => {
        return JSON.parse( permisionStr );
      })
    ;
  }
}