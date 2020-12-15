import { PermissionResponse } from "expo-location";

const LocationService = {
	addListener(clbk: Function){},
	getStoredPermission(): PermissionResponse {},
	getPermission():Promise<PermissionResponse>{},
	requestPermission():Promise<PermissionResponse>{},
	resetFence(){},
	startBackgroundLocationUpdates(){},
	stopBackgroundLocationUpdates(){},
	startTracking(){},
	stopTracking(){},
	updateLocation(force = false){},
	notifyLocationHandled( distanceToDiscovery ){}
}

export default LocationService;