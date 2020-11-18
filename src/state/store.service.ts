let store;

export default {
	init( st ){
		store = st;
	},

	getUserId(){
		return store.user.id;
	},

	getUserFGId( accountId ){
		return (accountId || store.user.id) + 'fg';
	},

	getStartAt( paginatedList, loadMore ){
		if( !loadMore || !paginatedList || !paginatedList.lastItemAt ){
			return '';
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

	getDiscovery( discoveryId ){
		return store.discoveries[ discoveryId ];
	},

	storeStory(story, discoveryId) {
		let currentStory = store.stories[story.id];
		if (!discoveryId && currentStory && currentStory.discoveryId ){
			discoveryId = currentStory.discoveryId;
		}

		story.lastUpdatedAt = Date.now();
		story.content = JSON.parse( story.content );
		story.aggregated = JSON.parse( story.aggregated );
		if( discoveryId ){
			story.discoveryId = discoveryId;
		}
		if( story.owner ){
			if( story.owner.id ) {
				story.ownerId = story.owner.id;
				this.storeStory(story.owner, story.id);
			}
			delete story.owner;
		}
		store.stories[story.id] = story;
	},

	storeComment(comment) {
		comment.content = JSON.parse( comment.content );
		store.comments[comment.id] = comment;
	},

	storeDiscovery(discovery) {
		discovery.lastUpdatedAt = Date.now();
		if( discovery.story ){
			if( discovery.story.id ){
				discovery.storyId = discovery.story.id;
				this.storeStory(discovery.story, discovery.id);
			}
			delete discovery.story;
		}
		if( discovery.discoverer ){
			if( discovery.discoverer.id ) {
				discovery.discovererId = discovery.discoverer.id;
				this.storeAccount(discovery.discoverer);
			}
			delete discovery.discoverer;
		}
		
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

	storeFenceDistance( distance ){
		store.distanceFromOutOfFence = distance;
	},

	getFenceDistance() {
		return store.distanceFromOutOfFence;
	},

	addLocationReport( locations ){
		let order = [];
		let items = {};

		locations.forEach( l => {
			order.push(l.id);
			items[l.id] = l;
		});

		let currentReport = store.locationReport;
		if( currentReport && !currentReport.slice && currentReport.order ){
			let limit = Math.min( 200 - order.length, currentReport.order.length );
			let i = 0;
			while( i < limit ){
				let id = currentReport.order[i];
				order.push( id );
				items[ id ] = currentReport.items[id];
				i++;
			}
		}

		store.locationReport = { order, items };
	},

	setLocationResult( id, result ){
		let { items } = store.locationReport;
		if( items[id] ) {
			items[id].result = result;
		}
	},

	addLocationReportOld( loc, isBgFetch = false){
		console.log('##### Adding to location report', store.locationReportOld && store.locationReportOld.length );
		let locations = store.locationReportOld && store.locationReportOld.slice ? store.locationReportOld.slice() : [];

		locations.unshift({
			isBgFetch,
			longitude: truncateDegrees(loc.longitude),
			latitude: truncateDegrees(loc.latitude),
			accuracy: parseInt(loc.accuracy),
			date: Date.now()
		});

		locations = locations.slice(0,100);
		store.locationReportOld = locations;
	},



	setLocationPermissions( permissions ){
		store.locationPermissions = permissions;
	},

	getComments( storyId ){
		return store.storyComments[ storyId ];
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
		store.peerAccounts = {};
		store.peerMeta = {};
		store.placesByLocation = {};
		
		store.storyComments = {};
		store.comments = {};

		delete store.user.stories;
		delete store.user.discoveries;
		delete store.locationReport;
	}
}

function getLocationKey( location ){
	const key = `${truncateDegrees(location.lat)},${truncateDegrees(location.lng)}`;
	return key;
}

function truncateDegrees( deg ){
	return Math.round( deg * 10000 ) / 10000;
}