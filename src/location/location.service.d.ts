import { PermissionResponse } from "expo-location";

interface BgPermission {
	foreground: boolean,
	background: boolean,
	timestamp: number
}

const LocationService = {
	addListener(clbk: Function){},
	getBackgroundPermission(): BgPermission {},
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