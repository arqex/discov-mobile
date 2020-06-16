
import storeService from '../store.service';
import actionService from './action.service';

let promises = {
	userFGs: []
}

export default function (store, api) {
	let loader, batchLoader;

	function initLoader() {
		loader = api.methods.getMultipleFollowerGroups(actionService.followerGroupFields);
		batchLoader = actionService.createBatchLoader(loader);
	}

	return {
		loadUserFollowerGroups(loadMore) {
			let startAt = storeService.getStartAt(store.user.followerGroups, loadMore);
			let promise = promises.userFGs[startAt];

			if (promise) return promise;

			let payload = {
				ownerId: storeService.getUserId(),
				startAt
			};

			return promises.userFGs[startAt] = api.methods
				.getFollowerGroupsByOwner(actionService.followerGroupPageFields)
				.run(payload)
				.then(fgPage => {
					let ids = [];

					fgPage.items.forEach(item => {
						storeService.storeFollowerGroup(item);
						ids.push(item.id);
					});

					let page = { ...fgPage, items: ids, lastUpdatedAt: Date.now() };
					if (startAt) {
						page.items = store.user.followerGroups.items.concat(page.items);
					}
					store.user.followerGroups = page;
					delete promises.userFGs[startAt];

					return fgPage;
				})
			;
		},

		load(groupId) {
			if (!batchLoader) {
				initLoader();
			}

			return batchLoader( groupId ).then( group => {
				if( group ){
					storeService.storeFollowerGroup( group );
				}
			})
		}
	} 
}