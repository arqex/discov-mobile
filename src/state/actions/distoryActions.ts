import storeService from '../store.service';
import actionService from './action.service'

let distoryFields = `{id story ${actionService.storyFields} discovery {id storyId ownerId discovererId createdAt extra}}`
let distoryListFields = `{hasMore lastItemAt items ${distoryFields} }`

let promise;
export default function ( store, api ){
	return {
		loadUserDistories( loadMore ){
			if( promise ) return promise;

			promise = api.gql.getAccountDistories( distoryListFields )
				.run( {accountId: store.user.id} )
				.then( response => {
					if( !response.error ){
						storeService.storeDistoryList( response, loadMore );
					}
					promise = false;
					return response;
				})
				.catch( error => {
					promise = false;
					return {error};
				})
			;

			return promise;
		}
	}
}