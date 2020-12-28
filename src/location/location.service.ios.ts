import * as ExpoLocation from 'expo-location';
import locationStore from './location.store';
import { log } from '../utils/logger';
import BgLocationManagerIos from './ios/BgLocationManager.ios';

let tracking = false;
export default {
	init( actions, store, services ){
		locationStore.init( store );
	},
	addListener(clbk) {
		BgLocationManagerIos.addListener(clbk);
	},
	getBackgroundPermission(){
		return ExpoLocation.getPermissionsAsync()
			.then( expoPermission => {
				let isGranted = expoPermission.ios.scope === 'always';
				let stored = locationStore.getBackgroundPermission();
				let now = Date.now();
				let permission;

				if( !stored ){
					permission = {
						isGranted,
						updated: now,
						checkedAt: now,
						requestedAt: 0
					}
				}
				else if( stored.isGranted === isGranted ){
					permission = {
						...stored,
						checkedAt: now
					}
				}
				else {
					permission = {
						...stored,
						isGranted,
						checkedAt: now,
						updatedAt: now
					}
				}

				locationStore.storeBackgroundPermission(permission);
				return permission;
			})
		;
	},
	getLastLocation(){
		return locationStore.getLastLocation();
	},
	getPermission(){
		return ExpoLocation.getPermissionsAsync()
			.then( permission => locationStore.storePermission(permission, false) )
		;
	},
	getStoredPermissions(){
		return {
			foreground: locationStore.getStoredPermission(),
			background: locationStore.getBackgroundPermission()
		};
	},
	requestPermission(){
		return ExpoLocation.requestPermissionsAsync()
			.then( permission => locationStore.storePermission(permission, true) )
		;
	},
	getFence(){
		return locationStore.getFenceData()
	},
	resetFence(){
		locationStore.clearFence();
	},
	startBackgroundLocationUpdates(){
		BgLocationManagerIos.startBackgroundLocationUpdates();
	},
	stopBackgroundLocationUpdates(){
		BgLocationManagerIos.stopBackgroundLocationUpdates();
	},
	startTracking(){
    tracking = true;
		BgLocationManagerIos.startTracking();
	},
	stopTracking(){
    tracking = false;
		BgLocationManagerIos.stopTracking();
	},
  isTracking(){
    return tracking;
  },
	updateLocation(force = false){
		BgLocationManagerIos.updateLocation();
	},
	notifyLocationHandled( distanceToDiscovery ){
		BgLocationManagerIos.notifyLocationHandled( distanceToDiscovery );
	}
}