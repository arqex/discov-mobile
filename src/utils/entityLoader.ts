export default function createEntityLoader({ store, storeAttribute, loadAction }) {
	var singlePromises = {};
	var batchPromise;

	function storeEntities( entities ){
		let byId = {};

		entities.forEach( e => {
			store[ storeAttribute ][ e.id ] = e;
			byId[ e.id ] = e;
		});

		return byId;
	}

	function getBatchPromise(){
		if( batchPromise ) return batchPromise;

		batchPromise = new Promise( resolve => {
			setTimeout( () => {
				let ids = Object.keys( singlePromises );

				loadAction.run( ids )
					.then( res => {
						batchPromise = false;
						resolve( storeEntities( res ) );
					})
				;
			}, 1);
		});

		return batchPromise;
	}


	return {
		get: function( id ){
			// If it's in the store, return it
			if( store[storeAttribute][id] )
				return store[storeAttribute][id]
			
			return false;
		},

		load: function( id ){
			if( singlePromises[id ] )
				return singlePromises[id];

			singlePromises[id] = getBatchPromise().then( entities => {
				return entities[id];
			});

			return singlePromises[id];
		},

		store: storeEntities
	}
}
