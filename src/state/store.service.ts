let store;

export default {
	init( st ){
		store = st;
	},

	getUserId(){
		return store.user.id;
	},

	getUserFGId(){
		return 'fg' + store.user.id;
	},

	getStartAt( paginatedList, loadMore ){
		if( !loadMore || !paginatedList || !paginatedList.lastItemAt ){
			return;
		}

		return paginatedList.lastItemAt;
	},

	getAccount( accountId ){
		return store.peerAccounts[accountId];
	},

	storeAccount( account ){
		account.lastUpdatedAt = Date.now();
		let oldAccount = store.peerAccounts[ account.id ];

		if (oldAccount) {
			account.isFollower = account.isFollower !== undefined ? account.isFollower : oldAccount.isFollower;
			account.isFollowing = account.isFollowing !== undefined ? account.isFollowing : oldAccount.isFollowing;
		}

		store.peerAccounts[account.id] = account;
	},

	getPeerMeta( accountId ){
		return store.peerMeta[ accountId ];
	},

	storePeerMeta( meta ){
		store.peerMeta[ meta.id ] = {
			lastUpdatedAt: Date.now(),
			valid: true,
			... JSON.parse( meta.data )
		};
	},

	invalidatePeerMeta( accountId ){
		if( store.peerMeta[ accountId ] ){
			console.log( store.peerMeta[accountId] );
			store.peerMeta[accountId].valid = false;
		}
	},

	getStory( storyId ){
		return store.stories[storyId];
	},

	storeStory(story) {
		story.lastUpdatedAt = Date.now();
		story.content = JSON.parse( story.content );
		story.aggregated = JSON.parse( story.aggregated );
		delete story.owner;
		store.stories[story.id] = story;
	},

	storeDiscovery(discovery) {
		discovery.lastUpdatedAt = Date.now();
		delete discovery.story;
		delete discovery.owner;
		delete discovery.discoverer;
		discovery.extra = JSON.parse(discovery.extra);
		store.discoveries[discovery.id] = discovery;
	},

	getUnseenDiscoveries( extraDiscoveries = [] ){
		let unseen = [ ...extraDiscoveries ];
		let extraIds = {};
		extraDiscoveries.forEach( d => extraIds[d.id] = 1 );

		let discoveriesPage = store.user.discoveries;
		let discoveries = store.discoveres;

		if( discoveriesPage && discoveriesPage.items ){
			let i = 0;
			while( i < discoveriesPage.items.length ) {
				let d = discoveries[ discoveriesPage.items[i] ];

				if( extraIds[ d.id ] ){
					continue;
				}

				if( d.seen ){
					return unseen;
				}
				else {
					let discovery = {
						...d,
						owner: store.peerAccounts[ d.ownerId ]
					};
					unseen.push( discoveries );
					i++;
				}
			}
		}

		return unseen;
	},

	getUnseenCount(){
		let count = 0;

		let userDiscoveries = store.user.discoveries;
		if( userDiscoveries && userDiscoveries.items ){
			userDiscoveries.items.forEach( id => {
				if( store.discoveries[id] && !store.discoveries[id].extra.seen ){
					count++;
				}
			})
		}

		return count;
	},

	getRelationship( relationshipId ) {
		return store.relationships
	},

	getFollowerGroup( groupId ){
		return store.followerGroups[ groupId ];
	},

	storeFollowerGroup( group ){
		store.followerGroups[ group.id ] = group;
	},

	getPlacesNearby( location ){
		return store.placesByLocation[ getLocationKey(location) ];
	},

	getLocationAddress(location) {
		return store.addressByLocation[getLocationKey(location)];
	},

	storePlacesNearby( location, places ){
		store.placesByLocation[ getLocationKey(location) ] = places;
	},

	storeLocationAddress( location, address ){
		store.addressByLocation[getLocationKey(location)] = address;
	},

	getCurrentPosition(){
		return store.currentPosition;
	},	

	storeCurrentPosition( coords, error? ){
		if( error ){
			return store.currentPosition = {
				status: error,
				updatedAt: Date.now(),
				coords: false
			};
		}

		store.currentPosition = {
			status: 'ok',
			updatedAt: Date.now(),
			coords
		}
	},

	getPassiveGeofence(){
		return store.passiveGeofence;
	},

	storePassiveGeoFence( location, radius ) {
		store.passiveGeofence = {
			updatedAt: ( new Date() ).toISOString(),
			latitude: location.latitude,
			longitude: location.longitude,
			radius: radius
		};
	},

	addLocationReport( loc ){
		let locations = store.locationReport && store.locationReport.slice ? store.locationReport.slice() : [];

		locations.unshift({
			longitude: loc.longitude,
			latitude: loc.latitude,
			accuracy: loc.accuracy,
			date: Date.now()
		});

		locations = locations.slice(0,100);
		store.locationReport = locations;
	},

	setLocationPermissions( permissions ){
		store.locationPermissions = permissions;
	},

	invalidateFollowers() {
		if( store.user.followers ){
			store.user.followers.valid = false;
		}
	},
	invalidateFollowing() {
		if( store.user.following ){
			store.user.following.valid = false;
		}
	},

	needOnboarding() {
		return store.user.account && store.user.account.extra.needOnboarding;
	},

	resetStore() {
		this.invalidateFollowers();
		this.invalidateFollowing();
		this.invalidatePeerMeta();
		
		delete store.user.stories;
		delete store.user.discoveries;
	}
}

function getLocationKey( location ){
	const key = `${truncateDegrees(location.lat)},${truncateDegrees(location.lng)}`;
	return key;
}

function truncateDegrees( deg ){
	return Math.round( deg * 10000 ) / 10000;
}