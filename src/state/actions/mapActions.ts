
import actionService from './action.service';
import storeService from '../store.service';
import { Alert } from 'react-native';
import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';

export default function (store, api) {

	return {
		loadPlacesNearby(location, radius = 200) {
			return api.methods.getPlacesNearby(actionService.placeFields)
				.run({ location, radius })
				.then(response => {
					storeService.storePlacesNearby( location, response );
					// console.log('Places nearby', response);
				})
			;
		},

		loadLocationAddress(location) {
			return api.methods.getLocationAddress(actionService.locationAddressFields)
				.run( location )
				.then(response => {
					// console.log('Address', response);
					storeService.storeLocationAddress(location, response);
					// console.log('Location address', response);
				})
			;
		},

		getCurrentPosition(){
			return getCurrentPositionAsync({ enableHighAccuracy: true, timeout: 20000 })
				.then( ({coords}) => {
					storeService.storeCurrentPosition(coords)
				})
				.catch(err => {
					console.log('Location not granted');
				})
			;
		}
	}
}


function requestGeolocation() {
	return requestPermissionsAsync()
		.then(res => console.log(res))
		.catch(err => console.log(err))
	;
}