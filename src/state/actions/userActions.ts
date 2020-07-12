import createEntityLoader from "../../utils/entityLoader";

const fullFields = `{id, displayName, avatarPic, description}`;
const simpleFields = `{id, displayName, avatarPic}`;

export default function( store, api ){
	store.usersMeta = {};
	store.users = {};
	store.relationships = {
		followers: {},
		followings: {}
	}

	var userLoader = createEntityLoader({
		store,
		storeAttribute: 'users',
		loadAction: api.methods.getMultiplePeerAccounts( fullFields )
	});
	
	return {

		getUser( userId ){
			return userLoader.get( userId );
		},

		loadUser( userId ){
			return userLoader.load( userId );
		},

		loadRelationships(type: string) {
			store.relationships[type].loading = true;
			return api.methods.getRelationshipAccounts(`{${type} { items${simpleFields} hasMore lastKey total }}`)
				.run({ accountId: store.user.id, type })
				.then(res => {
					let data = res[type];
					this.setUserData(data.items);

					store.relationships[type] = {
						users: data.items,
						total: data.total,
						hasMore: data.hasMore,
						lastKey: data.lastKey,
						loaded: true,
						loading: false,
						loadingPage: false
					};

					return res;
				})
			;
		},

		loadMoreRelationships( type: string ){
			let rel = store.relationships[type];
			if( !rel || !rel.hasMore ) return;
			
			store.relationships[type].loadingPage = true;
			return api.methods.getRelationshipAccounts(`{${type} { items${simpleFields} hasMore lastKey total }}`)
				.run({ accountId: store.user.id, type, startAt: rel.lastKey })
				.then( res => {
					let data = res[type];
					this.setUserData(data.items);
					
					store.relationships[type].users = store.relationships[type].users.concat( data.items );
					store.relationships[type].hasMore = data.hasMore;
					store.relationships[type].lastKey = data.lastKey;
					store.relationships[type].total = data.total;
					store.relationships[type].loadingPage = false;
				})
			;
		}
	}
}