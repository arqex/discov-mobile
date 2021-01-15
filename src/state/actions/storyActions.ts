
import storeService from '../store.service';
import actionService from './action.service';

let promises = {
	stories: {}
}

export default function (store, api) {
	let loader, batchLoader;
	function initLoader() {
		loader = api.gql.getMultipleStories(actionService.storyFields);
		batchLoader = actionService.createBatchLoader(loader);
	}

	return {
		load( storyId ) {
			if (!batchLoader) {
				initLoader();
			}
			return batchLoader( storyId ).then(story => {
				if (story) {
					storeService.storeStory(story);
				}
				else {
					return {error: 'not_found'};
				}
				return story;
			});
		},
		loadMultiple(ids) {
			return loader.run(ids).then(stories => {
				stories.forEach( story => {
					storeService.storeStory(story);
				});
				return stories;
			})
		},
		loadUserStories(loadMore) {
			let startAt = storeService.getStartAt(store.user.stories, loadMore);
			let promise = promises.stories[startAt];

			if (promise) return promise;

			let payload = {
				ownerId: storeService.getUserId(),
				startAt
			};

			return promises.stories[startAt] = api.gql.getStoriesByOwner(actionService.storyPageFields)
				.run( payload )
				.then( storyPage => {
					let ids = [];
					
					if( storyPage && storyPage.items ) {
						storyPage.items.forEach( item => {
							storeService.storeStory( item );
							ids.push( item.id );
						});
	
						let page = { ...storyPage, items: ids, lastUpdatedAt: Date.now() };
						if (startAt) {
							page.items = store.user.stories.items.concat(page.items);
						}
						store.user.stories = page; 
					}

					delete promises.stories[startAt];
					return storyPage;
				})
			;
		},
		
		getStoryInProgress( accountId ) {
			if( !store.storyInProgress ){
				const selectedFriends = {};

				if( accountId ){
					selectedFriends[ storeService.getUserFGId(accountId) ] = true;
				}
				
				store.storyInProgress = {
					location: false,
					discoveryRadius: 100,
					content: '',
					selectedFriends,
					images: []
				};
			}

			return store.storyInProgress;
		},

		clearStoryInProgress() {
			delete store.storyInProgress;
		},

		create( story ){
			return api.gql.createStory( actionService.storyFields )
				.run( story )
				.then( item => {
					storeService.storeStory(item);
					store.user.stories.items.unshift( item.id );
				})
			;
		}
	}
}