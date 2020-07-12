// TODO create a cache

let actions, store;

export const storyService = {

	init(ac, st) {
		actions = ac;
		store = st;
	},

	getAccountStories(){
		let accountStories = store.storiesByOwner[ store.user.id ];

		if( !accountStories ) return false;
		return accountStories;
	},

	loadAccountStories(){
		return actions.story.loadStories()
			.then( res => {
				return store.storiesByOwner[store.user.id]
			})
		;
	},

	loadMoreAccountStories(){
		return actions.story.loadMoreStories()
			.then( res => {
				return store.storiesByOwner[store.user.id]
			})
		;
	},

	getStory( storyId ){
		return store.stories[ storyId ] || false;
	},


	loadPromise: false,
	batchedStories: [],
	batchedPromises: {},

	// Stories are always batched trying to fetch
	// as many stories as possible in 1 request
	loadStory( storyId ){
		if( this.batchedPromises[storyId] ){
			return this.batchedPromises[storyId];
		}

		if( !this.loadingPromise ){
			this.loadingPromise = new Promise( resolve => {
				setTimeout( () => {
					this.loadBatchedStories().then( resolve );
				});
			});
		}

		this.batchedStories.push( storyId );
		this.batchedPromises[ storyId ] = new Promise( resolve => {
			this.loadingPromise.then( () => {
				let story = store.stories[ storyId ];
				resolve( story );
			})
		});

		return this.batchedPromises[storyId];
	},

	loadBatchedStories() {
		let storyIds = this.batchedStories;

		// We will start fetching, we can clear the batched data
		// to allow more requests
		this.batchedStories = [];
		this.batchedPromises = {};
		this.loadingPromise = false;

		return actions.stories.loadStoriesById( storyIds );
	},

	getDefaultRegion( storyLocation, currentPosition ){
		const latD = currentPosition ? Math.abs( currentPosition.latitude - storyLocation.location.lat ) * 1.1 : 1;
		const lngD = currentPosition ? Math.abs( currentPosition.longitude - storyLocation.location.lng ) * 1.1 : 1;

		return {
			longitude: storyLocation ? storyLocation.location.lng : 30,
			latitude: storyLocation ? storyLocation.location.lat : 5,
			latitudeDelta: currentPosition ? Math.max( latD, 0.005 ) * 2: 1,
			longitudeDelta: currentPosition ? Math.max( lngD, 0.005 )* 2: 1
		};
	}
}