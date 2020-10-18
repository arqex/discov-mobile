
import storeService from '../store.service';
import actionService from './action.service';
import { locationToLng } from '../../utils/maps';
import { log } from '../../utils/logger';
import axios from 'axios';

axios.interceptors.request.use(request => {
	let auth = request.headers.Authorization;
	log('Authorization', auth ? auth.slice(0,20) : 'none');
	return request;
});

axios.interceptors.response.use( r => r, error => {
	if( error && error.response ){
		log(`Request error ${error.response.status}`, JSON.stringify( error.response.data ) );
	}
  return error;
});


let promises = {
	discoveries: {}
}

export default function (store, api) {

	return {
		loadUserDiscoveries(loadMore) {
			let startAt = storeService.getStartAt(store.user.discoveries, loadMore);
			let promise = promises.discoveries[startAt];

			if (promise) return promise;

			let payload = {
				discovererId: storeService.getUserId(),
				startAt
			};

			return promises.discoveries[startAt] = api.gql
				.getDiscoveriesByDiscoverer(actionService.userDiscoveryPageFields)
				.run(payload)
				.then(discoveryPage => {
					let ids = [];

					discoveryPage.items.forEach( item => {
						storeService.storeStory(item.story);
						storeService.storeDiscovery( item );
						ids.push(item.id);
					});

					let page = { ...discoveryPage, items: ids, lastUpdatedAt: Date.now() };
					if (startAt) {
						page.items = store.user.discoveries.items.concat(page.items);
					}
					store.user.discoveries = page;
					delete promises.discoveries[startAt];
				})
			;
		},

		discoverAround( currentPosition ){
			let location = locationToLng( currentPosition );
			if( !location || !location.lat || !location.lng ){
				console.log('CANT DISCOVER AROUND WITH A GOOD LOCATION', currentPosition );
				return Promise.resolve({});
			}

			return api.gql.discoverAround(`{ closestDiscoveryDistance discoveries ${actionService.userDiscoveryFieldsWithOwner} }`)
				.run( location )
				.then( res => {
					store.user.closestDiscoveryDistance = res.closestDiscoveryDistance;

					if( res && res.discoveries && res.discoveries.length ){
						return this.loadUserDiscoveries()
							.then( () => res )
						;
					}

					if( !res || !res.discoveries ){
						log('Empty discoveries response?', JSON.stringify(res) );
						pingTest();
					}

					return res;
				})
			;
		},

		updateDiscoveryExtra( id, extra ) {

			// Update extra optimistically
			setTimeout( () => {
				let discovery = store.discoveries[id];
				discovery && (discovery.extra = extra);
			}, 500);

			const payload = {
				id,
				extra: JSON.stringify(extra)
			};
			return api.gql.updateDiscoveryExtra( actionService.userDiscoveryFields )
				.run( payload )
				.then( discovery => {
					storeService.storeDiscovery( discovery )
				})
				.catch( err => {
					console.log( 'DISCOVERY EXTRA ERROR', err );
					throw( err );
				})
			;
		}
	}
}



function pingTest() {
	fetch('https://httpstat.us/404').then( res => {
		log( 'Dummy ping', res.status );
	});
}