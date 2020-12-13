import { AppRegistry } from 'react-native';
import { log } from '../utils/logger';
import * as ExpoLocation from 'expo-location';
import fenceManager from './fence.manager';
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
	addListener( clbk ){
		clbks.push( clbk );
	},
	getPermissions(){
		return ExpoLocation.getPermissionsAsync();
	},
	requestPermissions(){
		return ExpoLocation.requestPermissionsAsync();
	},
	resetFence(){
		fenceManager.clearFence();
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