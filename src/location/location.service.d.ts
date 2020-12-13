const LocationService = {
	addListener(clbk: Function){},
	getPermissions():Promise<Boolean>{},
	requestPermissions():Promise<Boolean>{},
	resetFence(){},
	startBackgroundLocationUpdates(){},
	stopBackgroundLocationUpdates(){},
	startTracking(){},
	stopTracking(){},
	updateLocation(force = false){},
	notifyLocationHandled( distanceToDiscovery ){}
}

export default LocationService;