
import actionService from './action.service';
import storeService from '../store.service';
import { Alert, I18nManager } from 'react-native';
import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';
import * as RNLocalize from "react-native-localize";

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
		},

		searchPlaces( query:string, location: any ){
			let position = location || storeService.getCurrentPosition().coords || defaultLocation;

			let payload = {
				query,
				location: {
					lng: position.longitude,
					lat: position.latitude
				},
				sessionToken: getSessionToken,
				language: RNLocalize.getLocales()[0].languageTag
			}

			console.log( position, payload );

			return api.methods.searchPlaces( actionService.placeSearchResults )
				.run( payload )
			;
		},

		getSinglePlace( sourceId: string ){
			return api.methods.getSinglePlace( actionService.placeFields )
				.run( sourceId )
			;
		}
	}
}

const defaultLocation = {
	longitude: -5.98,
	latitude: 37.39
};

let sessionTokenData: any;
function getSessionToken(){
	if( sessionTokenData && sessionTokenData.updatedAt > Date.now() - 12000 ){
		return sessionTokenData.token;
	}

	sessionTokenData = {
		updatedAt: Date.now(),
		token: Math.round( Math.random() * 10000 ) + ''
	};

	return sessionTokenData.token;
}