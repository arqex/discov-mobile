import locationService from './location.service';
import { getDistance } from '../utils/maps';
import storeService from '../state/store.service';
import { dataService } from '../services/data.service';
import serverMessageService from '../services/serverMessage/serverMessage.service';
import { log } from '../utils/logger';
import { AppState, NativeModules } from 'react-native';
import * as Location from 'expo-location';

let hasPendingDiscoveries = true;
let lastUpdate = Date.now();
let currentlyInFence = false;
let passiveFence;

locationService.addListener( (result, source) => {
	let location = {
		...result,
		source,
		id: getRandomId()
	};

	log('----- Receiving location');
	// Render location available in the store for the rest of the app
	storeService.addLocationReportOld(location, false);
	storeService.addLocationReport( [location] )
	storeService.storeCurrentPosition(location);
	log('----- Position stored');

	return checkDiscoveries( location )
		.then( result => {
			storeService.setLocationResult( location.id , result);
		})
	;
});


function checkDiscoveries(location) {
	let apiClient = dataService.getApiClient();
	if (!apiClient || apiClient.getAuthStatus() !== 'IN') {
		log('----- User logged out');
		return Promise.resolve({ error: 'LOGGED_OUT' });
	}
	if (!dataService.getActions()) {
		log('----- Actions not ready yet');
		return Promise.resolve({ error: 'actions_not_ready' });
	}

	if (!hasAvailableDiscoveries()) {
		log('----- Nothing to discover');
		return Promise.resolve({ error: 'nothing_to_discover' });
	}

	if (isInGeoFence(passiveFence, location)) {
		log('----- Location in fence');
		return Promise.resolve({ error: 'location_in_fence' });
	}

	// From here we have a location out of the fence, we are close to
	// a discovery
	if (!inRequestPause()) {
		log('----- In request pause');
		return Promise.resolve({ error: 'in_pause' });
	}

	log('----- Getting discoveries!');
	return dataService.getActions().discovery.discoverAround(location)
		.then(res => onDiscoveryResponse(res, location))
		.then(res => {
			log('----- End location update');
			return { error: res && res.error || false };
		})
	;
}

const STALE_UPDATE_TIME = 5 * 60 * 1000;
function hasAvailableDiscoveries() {
	return hasPendingDiscoveries || (Date.now() - lastUpdate) > STALE_UPDATE_TIME;
}

const ACTIVE_RADIUS = 200;
function onDiscoveryResponse(res, location) {
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

	const distanceToDiscovery = res.closestDiscoveryDistance;

	NativeModules.BgLocation.setDistanceToDiscovery( distanceToDiscovery );

	hasPendingDiscoveries = distanceToDiscovery !== -1;
	lastUpdate = Date.now();

	if (!hasPendingDiscoveries) {
		// No discoveries around
		storeService.storeFenceDistance(0);
		return destroyFences();
	}

	const inFence = distanceToDiscovery > ACTIVE_RADIUS;
	if (inFence !== currentlyInFence) {
		console.log('Fence change!', inFence ? 'In the fence' : 'Out the fence');
		currentlyInFence = inFence;
	}
	else {
		console.log('Fence the same');
	}

	updateFences(location, distanceToDiscovery - ACTIVE_RADIUS);
}

// Ten seconds without requesting new discoveries
const REQUEST_PAUSE = 10000;
function inRequestPause() {
	let now = Date.now();
	let lastRequested = storeService.getDiscoveriesLastRequestedAt();
	if (!lastRequested || now - lastRequested > REQUEST_PAUSE) {
		storeService.setDiscoveriesLastRequestedAt(now);
		return true;
	}
	return false;
}

function updateFences(location, radius) {
	console.log('updateFences', radius);

	storeService.storeFenceDistance(radius);

	if (radius <= 0) {
		// We are out of the fences
		return destroyFences();
	}

	const candidateFence = {
		latitude: location.latitude,
		longitude: location.longitude,
		lastUpdated: new Date(),
		radius: 50
	};

	// We create a new fence if there isn't a current one
	// or if the current one doesn't contain the new fence
	if (!passiveFence || !fenceContainsFence(passiveFence, candidateFence)) {
		createFences(candidateFence);
	};
}

function fenceContainsFence(container, fence) {
	let centerDistance = getDistance(container, fence);
	return container.radius - centerDistance - fence.radius > 0;
}

function destroyFences() {
	log('Destroying fences');
	passiveFence = false;
	storeService.setDiscoveriesLastRequestedAt(0);
}

function createFences(circle) {
	passiveFence = circle;
}

// Two hours and the fence is not valid anymore
const FENCE_EXPIRY = 2 * 60 * 60 * 1000;
function isInGeoFence(fence, location) {
	console.log('Current fence', fence);
	if (!fence) return false;

	if (Date.now() - fence.lastUpdated > FENCE_EXPIRY) {
		console.log('fence expired');
		fence = false;
		return false;
	}

	if (fence.radius === -1) {
		// If there are no discoveries to do, it's like being in the fence
		return true;
	}

	let distance = getDistance(location, fence);
	return distance < fence.radius;
}

function createDiscoveriesNofication(discoveries) {
	let count = Math.max(discoveries.length, storeService.getUnseenCount());
	serverMessageService.close();

	const title = count > 1 ?
		__('notifications.multipleTitle', { count }) :
		__('notifications.singleTitle')
		;

	const message = count > 1 ?
		__('notifications.multipleMessage', { name: discoveries[0].owner.displayName }) :
		__('notifications.singleMessage', { name: discoveries[0].owner.displayName })
		;

	return serverMessageService.open({
		title,
		message,
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQanDmDzKGJxRcOsZJjuUwmHGgeKzaOeBaGnA&usqp=CAU'
	});
}


function classifyLocations(locations, source) {
	let batchId = getRandomId();
	let items = [];
	let initiator = source;
	if (source === 'LOCATION_TASK') {
		initiator = AppState.currentState === 'active' ? 'FORE_TASK' : 'BG_TASK';
	}
	locations.forEach(location => {
		items.unshift({
			...location.coords,
			timestamp: location.timestamp,
			batchId,
			id: getRandomId(),
			initiator
		})
	});

	return { batchId, items };
}

function getRandomId() {
	return '' + Math.random();
}

export default {
	requestPermissions() {
		return Location.requestPermissionsAsync()
			.then( permissions => {
				storeService.setLocationPermissions(permissions);
				return permissions;
			})
		;
	},
	getPermissions() {
		return Location.getPermissionsAsync()
			.then( permissions => {
				storeService.setLocationPermissions(permissions);
				return permissions;
			})
		;
	},
	getFenceData() {
    return {
      passiveFence: passiveFence,
      distanceFromOutOfFence: storeService.getFenceDistance()
    };
	},
	resetFence(){
    hasPendingDiscoveries = true;
    destroyFences();
  },
}
