
let actions, store, services;

export const usersService = {
	init(ac, st, sr) {
		actions = ac;
		store = st;
		services = sr;
	},

	followers: createRelationshipService('followers'),
	following: createRelationshipService('following'),

	getUser(userId, isFullUser) {
		return actions.user.getUser( userId );
	},

	loadUser(userId, isFullUser = false){
		return actions.user.loadUser( userId );
	}
}

function createRelationshipService( type ){
	return {
		loadPromise: false,

		get: function() {
			let rel = store.relationships[ type ];
			if( !rel || !rel.loaded ){
				return false;
			}

			return {
				users: rel.users,
				total: rel.total
			};
		},

		preload: function(){
			// if loaded just return
			if( this.get() ) return;

			return this.load();
		},

		load: function () {
			let rel = store.relationships[type];
			if( rel && rel.loading ){
				return this.loadPromise;
			}
			
			this.loadPromise = actions.user.loadRelationships(type)
				.then( () => {
					return this.get();
				})
			;

			return this.loadPromise;
		},

		loadMore: function () {
			let rel = store.relationships[type];
			if (rel && rel.loadingPage) {
				return this.loadPromise;
			}

			this.loadPromise = actions.user.loadMoreRelationships(type)
				.then(() => {
					return this.get();
				})
			;
			return this.loadPromise;
		},

		isLoading: function () {
			let rel = store.relationships[type];
			return rel && rel.isLoading;
		},

		isLoadingPage: function () {
			let rel = store.relationships[type];
			return rel && rel.isLoadingPage;
		}
	}
}