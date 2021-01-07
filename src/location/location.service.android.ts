import { AppRegistry } from 'react-native';
import { log } from '../utils/logger';
import * as ExpoLocation from 'expo-location';
import locationStore from './location.store';
import BgLocation from './android/BgLocation';
import serverMessageHandler from '../services/serverMessage/serverMessage.handler';

let services;
let clbks = [];
AppRegistry.registerHeadlessTask('DISCOV_HEADLESS_LOCATION', () => async (taskData) => {
	if (taskData.location) {
		let data = JSON.parse(taskData.location);
		clbks.forEach(clbk => clbk(data, taskData.source));
	}
	else if( taskData.notificationId ){
		let notification = serverMessageHandler.handleMessage(taskData.notificationId)
		if( notification && services ){
			services.serverMessage.open(notification.notification);
		}
		log(`!!!Open notification: ${taskData.notificationId}`)
	}
	else if( taskData.signal ){
		log(`!!!Signal received: ${ taskData.signal}`);
	}
});

let trackingActive = false;

export default {
	init( actions, store, sv ){
		services = sv;
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
	getFence(){
		return locationStore.getFenceData()
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
		trackingActive = true;
		BgLocation.startTracking();
	},
	stopTracking(){
		trackingActive = false;
		BgLocation.stopTracking();
	},
	isTracking(){
		return trackingActive;
	},
	updateLocation(force = false){
		return BgLocation.updateLocation( force );
	},
	notifyLocationHandled( distanceToDiscovery ){
		return BgLocation.setDistanceToDiscovery( distanceToDiscovery );
	},
	getDebugMode(){
		return BgLocation.getDebugMode()
	},
	setDebugMode( value: boolean ){
		return BgLocation.setDebugMode(value)
	}
}