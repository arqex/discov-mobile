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
  updateLocation(){
    NativeModules.BgLocation.updateLocation();
  }
}