const page = `{ total hasMore lastItemAt items % }`;

const userAccountFields = '{id email handle displayName avatarPic description createdAt updatedAt extra}';
const peerAccountFields = '{id handle displayName avatarPic description}';
const peerAccountPageFields = page.replace('%', peerAccountFields );
const peerMetaFields = '{id data}';

const relationshipFields = '{accountId followerId status updatedAt createdAt aggregated}';
const followerFields = `{accountId followerId status updatedAt createdAt aggregated follower ${peerAccountFields} }`;
const followingFields = `{accountId followerId status updatedAt createdAt aggregated account ${peerAccountFields} }`;

const followerGroupMemberFields = `{ groupId memberId createdAt active }`;
const followerGroupMemberPageFields = page.replace( '%', followerGroupMemberFields );
const followerGroupFields = `{ id ownerId name aggregated createdAt updatedAt members ${followerGroupMemberPageFields}}`
const followerGroupPageFields = page.replace('%', followerGroupFields);

const followerPageFields = page.replace('%', followerFields);
const followingPageFields = page.replace('%', followingFields);

const locationFields = `{lng lat}`
const locationAddressFields = `{formatted parts {longName shortName type}}`;
const placeFields = `{sourceId name type location ${locationFields} ne ${locationFields} sw ${locationFields}}`;
const placeSearchResults = `{sourceId mainText secondaryText type }`

const storyFields = '{id ownerId lng lat content aggregated createdAt status}';
const userDiscoveryFields = `{id storyId ownerId discovererId createdAt extra story ${storyFields}}`;
const userDiscoveryFieldsWithOwner = `{id storyId ownerId discovererId createdAt extra story ${storyFields} owner ${peerAccountFields}}`;
const storyDiscoveryFields = `{id storyId ownerId discovererId createdAt extra discoverer ${peerAccountFields}}`;
const storyPageFields = page.replace('%', storyFields);
const userDiscoveryPageFields = page.replace('%', userDiscoveryFields);

const storyCommentFields = '{id storyId commenterId content deleted createdAt relatedCommentId}';
const storyCommentPageFields = page.replace('%', storyCommentFields);

export default {
	userAccountFields,
	peerAccountFields,
	peerAccountPageFields,
	peerMetaFields,
	relationshipFields,
	followerPageFields,
	followingPageFields,
	followerGroupMemberFields,
	followerGroupMemberPageFields,
	followerGroupFields,
	followerGroupPageFields,
	placeFields,
	placeSearchResults,
	locationAddressFields,
	storyFields,
	userDiscoveryFields,
	userDiscoveryFieldsWithOwner,
	storyDiscoveryFields,
	storyPageFields,
	userDiscoveryPageFields,
	storyCommentFields,
	storyCommentPageFields,

	createBatchLoader( loader ){
		let loadPromise: any = false;
		let batchedIds = [];
		let	batchedPromises = {};

		function loadBatched() {
			let ids = batchedIds;

			// We will start fetching, we can clear the batched data
			// to allow more requests in a next batch
			batchedIds = [];
			batchedPromises = {};
			loadPromise = false;

			return loader.run( ids ).then( results => {
				if( !results ){
					return console.error('No results');
				}

				if( results.error ){
					return console.error( results.error );
				}

				if( !results.forEach ){
					return console.error('Results is not an array');
				}
				
				let byId = {};
				results.forEach( r => byId[r.id] = r );
				return byId;
			});
		}

		// trying to fetch
		// as many items as possible in 1 request
		return function batchLoad( id ){
			if (batchedPromises[id]) {
				return batchedPromises[id];
			}

			if (!loadPromise) {
				loadPromise = new Promise(resolve => {
					setTimeout(() => {
						loadBatched().then( resolve );
					});
				});
			}

			batchedIds.push(id);
			return batchedPromises[id] = new Promise(resolve => {
				loadPromise.then( byIds => {
					resolve( byIds[id] );
				})
			});
		}
	}
}