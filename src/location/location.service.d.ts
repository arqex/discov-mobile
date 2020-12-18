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

export interface FgPermission extends BgPermission{
	canAskAgain: boolean
}

const LocationService = {
	addListener(clbk: (location:BgLocation, source: String) => void){},
	getBackgroundPermission(): Promise<BgPermission> {},
	getLastLocation(): BgLocation | undefined {},
	getPermission():Promise<FgPermission>{},
	getStoredPermission(): FgPermission | undefined {},
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