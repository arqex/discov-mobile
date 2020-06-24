
import storeService from '../store.service';
import actionService from './action.service';
import { locationToLng } from '../../utils/maps';

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

			return promises.discoveries[startAt] = api.methods
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
			
			return api.methods.discoverAround(`{ closestDiscoveryDistance discoveries ${actionService.userDiscoveryFieldsWithOwner} }`)
				.run( location )
				.then( res => {
					store.user.closestDiscoveryDistance = res.closestDiscoveryDistance;

					console.log('Discover around OK', res);

					if( res.discoveries.length ){
						return this.loadUserDiscoveries()
							.then( () => res )
						;
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
			return api.methods.updateDiscoveryExtra( actionService.userDiscoveryFields )
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