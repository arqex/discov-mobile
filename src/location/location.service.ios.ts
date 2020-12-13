import * as ExpoLocation from 'expo-location';
import fenceManager from './fence.manager';
import { log } from '../utils/logger';

let clbks = [];
export default {
	addListener(clbk) {
		clbks.push(clbk);
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