
import storeService from '../store.service';
import actionService from './action.service';
import { locationToLng } from '../../utils/maps';
import { log } from '../../utils/logger';


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
				log('CANT DISCOVER AROUND WITH A GOOD LOCATION', currentPosition );
				return Promise.resolve({});
			}

			return api.gql.discoverAround(`{ closestDiscoveryDistance discoveries ${actionService.userDiscoveryFieldsWithOwner} }`)
				.run( location )
				.then( res => {
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
		},
		load( id ){
			return api.gql.getSingleDiscovery( actionService.userDiscoveryFields )
				.run( id )
				.then( discovery => {
					storeService.storeDiscovery( discovery )
				})
			;
		},
		loadByStoryAndDiscoverer( storyId, discovererId ){
			return api.gql.getDiscoveryByStoryAndDiscoverer( actionService.userDiscoveryFields )
				.run({storyId, discovererId})
				.then( discovery => {
					storeService.storeDiscovery( discovery );
					return discovery;
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