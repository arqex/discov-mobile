import * as ExpoLocation from 'expo-location';
import locationStore from './location.store';
import { log } from '../utils/logger';

let clbks = [];
export default {
	init( actions, store, services ){
		locationStore.init( store );
	},
	addListener(clbk) {
		clbks.push(clbk);
	},
	getBackgroundPermission(){},
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
		log("startBackgroundLocationUpdates not implemented");
	},
	stopBackgroundLocationUpdates(){
		log("stopBackgroundLocationUpdates not implemented");
	},
	startTracking(){
		log("startTracking not implemented");
	},
	stopTracking(){
		log("stopTracking not implemented");
	},
	updateLocation(force = false){
		log("updateLocation not implemented");
	},
	notifyLocationHandled( distanceToDiscovery ){
		log("notifyLocationHandled not implemented");
	}
}