import locationService, {BgLocation} from './location.service';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import serverMessageService from '../services/serverMessage/serverMessage.service';
import { log } from '../utils/logger';
import locationStore from './location.store';
import appStateService from '../services/appState.service';

let router;
export default {
	init( r ){
		router = r;
		dataService.init().then( () => {
			locationService.addListener( onLocation );

			locationStore.init( dataService.getStore() );
		});

		appStateService.addChangeListener( status => {
			status === 'active' ?
				onGoingToForeground() :
				onGoingToBackground()
			;
		})
	}
};

function onLocation( result: BgLocation, source: String ) {
	let location = {
		...result,
		source,
		id: getRandomId()
	};

	if( !dataService.getActions() ){
		setTimeout( () => handleDiscoveryRequest(location), 100 );
	}
	else {
		handleDiscoveryRequest(location);
	}
};

function handleDiscoveryRequest( location ) {
	locationStore.saveLocationReport( location );

	let result = checkDiscoveries( location )
		.then( result => {
			if( result.error ){
				if( result.error !== 'discovery_error' ){
					locationService.notifyLocationHandled( locationStore.NOT_TRIED );
				}
			}
			else {
				locationStore.updateFence( location, result.distanceToDiscovery );
				locationService.notifyLocationHandled( result.distanceToDiscovery );
			}


			locationStore.updateLocationReportResult( location.id , result );
			let r = dataService.getStore().locationData.report.items[location.id].result;
			console.log( r );
		})
	;

	locationStore.storeLastLocation( location );
	return result;
}

function checkDiscoveries(location) {
	let apiClient = dataService.getApiClient();
	if (!apiClient || apiClient.getAuthStatus() !== 'IN') {
		log('----- User logged out');
		return Promise.resolve({ error: 'LOGGED_OUT' });
	}

	if ( !locationStore.hasAvailableDiscoveries() ) {
		log('----- Nothing to discover');
		return Promise.resolve({ error: 'nothing_to_discover' });
	}

	if ( locationStore.isInFence(location) && !locationService.isTracking() ) {
		log('----- Location in fence');
		return Promise.resolve({ error: 'location_in_fence' });
	}

	if ( isInPause() ) {
		log('----- In request pause');
		return Promise.resolve({ error: 'in_pause' });
	}

	log('----- Getting discoveries!');
	locationStore.setLastTriedAt( Date.now() );
	return dataService.getActions().discovery.discoverAround(location)
		.then(res => onDiscoveryResponse(res))
		.then(res => {
			log('----- End location update');
			return { error: false, ...res };
		})
		.catch( err => {
			console.log('ERROR discovering', err );
		})
	;
}

function onDiscoveryResponse(res) {
	console.log('On discovery response');
	if (!res || !res.discoveries) return {error: "discovery_error"};

	// Notify new discoveries 
	if (res.discoveries && res.discoveries.length) {
		log('New discoveries: ' + res.discoveries.length);
		createDiscoveriesNofication(res.discoveries);
	}
	else {
		log('No new discoveries');
	}

	return { distanceToDiscovery: res.closestDiscoveryDistance };
}

// Ten seconds without requesting new discoveries
const REQUEST_PAUSE = 10000;
function isInPause() {
	let lastTriedAt = locationStore.getLastTriedAt();
	if( !lastTriedAt ) return false;

	let now = Date.now();
	return now < lastTriedAt + REQUEST_PAUSE;
}

function createDiscoveriesNofication(discoveries) {
	let count = Math.max(discoveries.length, storeService.getUnseenCount());
	serverMessageService.close();

	const owner = discoveries[0].owner;
	const title = count > 1 ?
		__('notifications.multipleTitle', { count }) :
		__('notifications.singleTitle')
		;

	const message = count > 1 ?
		__('notifications.multipleMessage', { name: owner.displayName }) :
		__('notifications.singleMessage', { name: owner.displayName })
	;

	let notification: any = {title,message};
	if( owner.avatarPic ){
		notification.image = owner.avatarPic;
	}

	return serverMessageService.open( notification );
}

function getRandomId() {
	return '' + Math.random();
}

function onGoingToBackground() {
	locationService.stopTracking();
}

function onGoingToForeground() {
	dataService.init().then( () => {
		locationService.updateLocation(true);
		locationService.getBackgroundPermission();
		locationService.getPermission().then( permission => {
			if( permission.isGranted && dataService.getAuthStatus() === 'IN' ){
				locationService.startBackgroundLocationUpdates();
			}
		})
	});
}