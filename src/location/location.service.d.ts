const LocationService = {
	init(actions, store, services){},
	addListener(clbk: (location:BgLocation, source: String) => void){},
	getBackgroundPermission(): Promise<BgPermission> {},
	getLastLocation(): BgLocation | undefined {},
	getPermission():Promise<FgPermission>{},
	getStoredPermissions(): StoredPermissions {},
	requestPermission():Promise<FgPermission>{},
	getFence(): LocationFence{},
	resetFence(){},
	startBackgroundLocationUpdates(){},
	stopBackgroundLocationUpdates(){},
	startTracking(){},
	stopTracking(){},
	isTracking(): boolean {},
	updateLocation(force = false){},
	notifyLocationHandled( distanceToDiscovery ){},
	getDebugMode(): Promise<boolean> {},
	setDebugMode(value: boolean) {},
}

export default LocationService;