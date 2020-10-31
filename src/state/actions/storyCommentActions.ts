import storeService from '../store.service';
import actionService from './action.service';

let promises = {
	stories: {}
};

export default function (store, api){

	return {
		loadStoryComments(storyId, loadMore) {
			const startAt = storeService.getStartAt(store.storyComments[storyId], loadMore);
			const promise = promises.stories[startAt];
			if (promise) return promise;

			return promises.stories[startAt] = api.gql.getStoryComments( actionService.storyCommentPageFields )
				.run( {storyId, startAt} )
				.then( commentsPage => {
					let ids = [];
					if( commentsPage && commentsPage.items ) {
						const currentComments = store.storyComments[storyId];

						commentsPage.items.forEach( item => {
							storeService.storeComment( item );
							ids.unshift( item.id );
						});

						let page = {  ...commentsPage, items: ids, lastUpdatedAt: Date.now() };
						if(startAt && currentComments){
							page.items = page.items.concat(currentComments.items);
						}
						store.storyComments[storyId] = page;

						let story = store.stories[storyId];
						if( story ){
							story.aggregated.commentsCount = commentsPage.total;
						}
					}
					delete promises.stories[storyId];
					return commentsPage;
				})
			;
		},
		refreshStoryComments( storyId ){
			const promise = promises.stories[''];
			if (promise) return promise;

			return promises.stories[''] = api.gql.getStoryComments( actionService.storyCommentPageFields )
				.run( {storyId} )
				.then( commentsPage => {
					if( commentsPage && commentsPage.items ) {
						let ids = [];
						commentsPage.items.forEach( item => {
							storeService.storeComment( item );
							ids.unshift( item.id );
						});

						ids = mergeIds( ids, store.storyComments[storyId] );
						store.storyComments[storyId] = {
							...commentsPage, items: ids, lastUpdatedAt: Date.now()
						};
						let story = store.stories[storyId];
						if( story ){
							story.aggregated.commentsCount = commentsPage.total;
						}
					}
					delete promises.stories[storyId];
					return commentsPage;
				})
				.catch( err => {
					delete promises.stories[storyId];
				})
			;
		},
		create(comment) {
			return api.gql.createStoryComment(actionService.storyCommentFields)
				.run(comment)
				.then(item => {
					storeService.storeComment(item);
					let page = store.storyComments[comment.storyId];
					page.items.push(item.id);
					page.total++;
					let story = store.stories[comment.storyId];
					if( story ){
						if( story.aggregated.commentsCount ) {
							story.aggregated.commentsCount++;
						}
						else {
							story.aggregated.commentsCount = 1;
						}
					}
				})
			;
		}
	}
}

function mergeIds( nextIds, commentsPage ){
	if( !commentsPage ) return nextIds;
	let currentIds = commentsPage.items;
	let i = 0;
	while( i < currentIds.length ){
		if( currentIds[i] === nextIds[0] ){
			return currentIds.slice(0, i).concat( nextIds );
		}
		i++;
	}
	return nextIds;
}