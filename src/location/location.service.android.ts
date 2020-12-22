import { AppRegistry } from 'react-native';
import { log } from '../utils/logger';
import * as ExpoLocation from 'expo-location';
import locationStore from './location.store';
import BgLocation from './android/BgLocation';

let clbks = [];
AppRegistry.registerHeadlessTask('DISCOV_HEADLESS_LOCATION', () => async (taskData) => {
	if (taskData.location) {
		let data = JSON.parse(taskData.location);
		clbks.forEach(clbk => clbk(data, taskData.source));
	}
	else if( taskData.signal ){
		log(`!!!Signal received: ${ taskData.signal}`);
	}
});

export default {
	init( actions, store, services ){
		locationStore.init( store );
	},
	addListener( clbk ){
		clbks.push( clbk );
	},
	getBackgroundPermission() {
		return BgLocation.getBackgroundLocationPermission()
			.then( bgPermission => {
				locationStore.storeBackgroundPermission(bgPermission)
				return locationStore.getBackgroundPermission();
			})
		;
	},
	getLastLocation(){
		return locationStore.getLastLocation();
	},
	getStoredPermissions(){
		return {
			foreground: locationStore.getStoredPermission(),
			background: locationStore.getBackgroundPermission()
		};
	},
	getPermission(){
		return ExpoLocation.getPermissionsAsync()
			.then( permission => locationStore.storePermission(permission, false) )
		;
	},
	requestPermission(){
		return ExpoLocation.requestPermissionsAsync()
			.then( permission => locationStore.storePermission(permission, true) )
		;
	},
	resetFence(){
		locationStore.clearFence();
	},
	startBackgroundLocationUpdates(){
		BgLocation.startBackgroundLocationUpdates();
	},
	stopBackgroundLocationUpdates(){
		BgLocation.stopBackgroundLocationUpdates();
	},
	startTracking(){
		BgLocation.startTracking();
	},
	stopTracking(){
		BgLocation.stopTracking();
	},
	updateLocation(force = false){
		BgLocation.updateLocation( force );
	},
	notifyLocationHandled( distanceToDiscovery ){
		BgLocation.setDistanceToDiscovery( distanceToDiscovery );
	}
}