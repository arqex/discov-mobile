export interface BgLocation {
	accuracy: number,
	altitude: number,
	bearing: number,
	id?: string,
	latitude: number,
	longitude: number,
	source?: string,
	timestamp: number
}
export interface BgPermission {
	isGranted: boolean,
	updatedAt: number,
	checkedAt: number,
	requestedAt: number
}

export interface StoredPermissions {
	foreground?: FgPermission,
	background?: BgPermission
}

export interface FgPermission extends BgPermission{
	canAskAgain: boolean
}

export interface LocationFence {
	location: BgLocation,
	distanceToDiscovery: number
}

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