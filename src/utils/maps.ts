
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