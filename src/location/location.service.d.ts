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

const LocationService = {
	init(actions, store, services){},
	addListener(clbk: (location:BgLocation, source: String) => void){},
	getBackgroundPermission(): Promise<BgPermission> {},
	getLastLocation(): BgLocation | undefined {},
	getPermission():Promise<FgPermission>{},
	getStoredPermissions(): StoredPermissions {},
	requestPermission():Promise<FgPermission>{},
	resetFence(){},
	startBackgroundLocationUpdates(){},
	stopBackgroundLocationUpdates(){},
	startTracking(){},
	stopTracking(){},
	updateLocation(force = false){},
	notifyLocationHandled( distanceToDiscovery ){}
}

export default LocationService;