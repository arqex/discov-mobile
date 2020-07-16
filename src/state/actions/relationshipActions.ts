import storeService from '../store.service';
import actionService from './action.service';

let promises = {
	followers: {},
	following: {}
};

export default function (store, api) {
	return {
		loadUserFollowers: function (loadMore) {
			let startAt = storeService.getStartAt( store.user.followers, loadMore );
			let promise = promises.followers[startAt];

			if (promise) return promise;

			let payload = {
				accountId: storeService.getUserId(),
				startAt
			};

			return promises.followers[startAt] = api.gql.getFollowers( actionService.followerPageFields )
				.run( payload )
				.then( followerPage => {
					let lastUpdatedAt = Date.now();
					let ids = [];

					delete promises.followers[startAt];

					followerPage.items.forEach( item => {
						let account = { ...item.follower };
						account.lastUpdatedAt = lastUpdatedAt;
						account.isFollower = {
							lastUpdatedAt,
							createdAt: item.createdAt,
							status: item.status,
							aggregated: JSON.parse( item.aggregated )
						};

						storeService.storeAccount( account );
						ids.push( account.id );
					});

					let page = {
						...followerPage,
						items: ids,
						lastUpdatedAt,
						valid: true
					};

					if( startAt ){
						page.items = store.account.followers.items.concat( page.items );
					}
					else {
						checkFollowersGroup(store, payload.accountId, page);
					}

					store.user.followers = page;
				})
			;
		},

		loadUserFollowing: function (loadMore) {
			let startAt = storeService.getStartAt(store.user.following, loadMore);
			let promise = promises.following[startAt];

			if (promise) {
				console.log('Returning previous promise');
				return promise;
			}

			let payload = {
				followerId: storeService.getUserId(),
				startAt
			};

			return promises.following[startAt] = api.gql.getFollowing(actionService.followingPageFields)
				.run(payload)
				.then(followingPage => {
					let lastUpdatedAt = Date.now();
					let ids = [];

					delete promises.following[startAt];

					followingPage.items.forEach(item => {
						let account = { ...item.account };
						account.lastUpdatedAt = lastUpdatedAt;
						account.isFollowing = {
							lastUpdatedAt,
							createdAt: item.createdAt,
							status: item.status,
							aggregated: JSON.parse(item.aggregated)
						};

						storeService.storeAccount(account);
						ids.push(account.id);
					});

					let page = {
						...followingPage,
						items: ids,
						lastUpdatedAt,
						valid: true
					};

					if (startAt) {
						page.items = store.account.following.items.concat(page.items);
					}

					store.user.following = page;

					console.log('Updated following page');
				})
			;
		},
		follow( accountId ) {
			return api.gql.follow( '{success}' )
				.run( accountId )
				.then( () => {
					let storedMeta = store.peerMeta[ accountId ];
					if( storedMeta ){
						console.log('UPDATING META OPTIMISTICALLY');
						storedMeta.asPublisher.following = true;
					}

					storeService.invalidateFollowing();
					storeService.invalidatePeerMeta( accountId );
				})
			;
		},
		unfollow( accountId ) {
			return api.gql.unfollow( '{success}' )
				.run( accountId )
				.then( () => {

					let storedMeta = store.peerMeta[accountId];
					if (storedMeta) {
						console.log('UPDATING META OPTIMISTICALLY');
						storedMeta.asPublisher.following = false;
					}
					storeService.invalidateFollowing();
					storeService.invalidatePeerMeta( accountId );
				})
			;
		}
	}
}


function checkFollowersGroup( store, accountId, followers ){
	let groupId = 'fg' + accountId;
	if( store.followerGroups[ groupId ] ) return;

	store.followerGroups[groupId] = {
		id: groupId,
		ownerId: accountId,
		name: 'All followers',
		aggregated: {},
		createdAt: Date.now(),
		updatedAt: Date.now(),
		members: followers
	}
}