import * as ExpoLocation from 'expo-location';
import locationStore from './location.store';
import { log } from '../utils/logger';

let clbks = [];
export default {
	addListener(clbk) {
		clbks.push(clbk);
	},
	getBackgroundPermission(){},
	getStoredPermission(){
		return locationStore.getStoredPermission();
	},
	getPermission(){
		return ExpoLocation.getPermissionsAsync()
			.then( permission => {
				locationStore.storePermission(permission);
				return permission;
			})
		;
	},
	
	requestPermissions(){
		return ExpoLocation.requestPermissionsAsync()
			.then( permission => {
				locationStore.storePermission(permission);
				return permission;
			})
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