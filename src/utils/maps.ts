
import haversine from 'haversine';

export function locationToLng(location){
	return { lat: location.latitude, lng: location.longitude };
}

export function lngToLocation(lng){
	return { latitude: lng.lat, longitude: lng.lng };
}

export function getDistance( p1: any, p2: any ){
	//console.log('haversine', p1, p2, haversine(p1,p2, {unit: 'meter'}) );
	return haversine( p1, p2, {unit: 'meter'} );
}

// Adapted from https://github.com/react-native-maps/react-native-maps/issues/505#issuecomment-301308736
export function getRegion( latitude: number, longitude: number, distance: number ){
	const circumference = 40075000
	const oneDegreeOfLatitudeInMeters = 111320
	const angularDistance = distance/circumference

	const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
	const longitudeDelta = Math.abs(Math.atan2(
		Math.sin(angularDistance)*Math.cos(latitude),
		Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(latitude)
	))

	return {
			latitude,
			longitude,
			latitudeDelta,
			longitudeDelta,
	}
}