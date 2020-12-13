import locationService from './location.service';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import serverMessageService from '../services/serverMessage/serverMessage.service';
import { log } from '../utils/logger';
import { AppState } from 'react-native';
import fenceManager from './fence.manager';

export default {
	init(){
		dataService.init().then( () => {
			locationService.addListener( onLocation );

			fenceManager.init( dataService.getStore() );
	
			AppState.addEventListener( 'change', status => {
				if( status !== 'active' ){
					locationService.stopTracking();
				}
				else {
					locationService.updateLocation();
				}
			})
		})
	}
};

function onLocation( result, source ) {
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
	return checkDiscoveries( location )
		.then( result => {
			fenceManager.storeLastLocation( location );

			if( result.error ){
				if( result.error !== 'discovery_error' ){
					locationService.notifyLocationHandled( fenceManager.NOT_TRIED );
				}
			}
			else {
				fenceManager.updateFence( location, result.distanceToDiscovery );
				locationService.notifyLocationHandled( result.distanceToDiscovery );
			}

			storeService.setLocationResult( location.id , result );
		})
	;
}

function checkDiscoveries(location) {
	let apiClient = dataService.getApiClient();
	if (!apiClient || apiClient.getAuthStatus() !== 'IN') {
		log('----- User logged out');
		return Promise.resolve({ error: 'LOGGED_OUT' });
	}

	if ( !fenceManager.hasAvailableDiscoveries() ) {
		log('----- Nothing to discover');
		return Promise.resolve({ error: 'nothing_to_discover' });
	}

	if ( fenceManager.isInFence(location) ) {
		log('----- Location in fence');
		return Promise.resolve({ error: 'location_in_fence' });
	}

	if ( isInPause() ) {
		log('----- In request pause');
		return Promise.resolve({ error: 'in_pause' });
	}

	log('----- Getting discoveries!');
	return dataService.getActions().discovery.discoverAround(location)
		.then(res => onDiscoveryResponse(res))
		.then(res => {
			log('----- End location update');
			return { error: false, ...res };
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

	return {distanceToDiscovery: res.distanceToDiscovery};
}

// Ten seconds without requesting new discoveries
const REQUEST_PAUSE = 10000;
function isInPause() {
	let fence = fenceManager.getFenceData();
	if( !fence ) return false;

	let now = Date.now();
	return now < fence.location.timestamp + REQUEST_PAUSE;
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
