import { loadOptions } from '@babel/core';
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

			promises.stories[startAt] = api.gql.getStoryComments( actionService.storyCommentPageFields )
				.run( {storyId, startAt} )
				.then( commentsPage => {
					let ids = [];
					if( commentsPage && commentsPage.items ) {
						commentsPage.items.forEach( item => {
							storeService.storeComment( item );
							ids.push( item.id );
						});

						let page = {  ...commentsPage, items: ids, lastUpdatedAt: Date.now() };
						if(startAt){
							page.items = store.storyComments.items.concat(page.items);
						}
						store.storyComments[storyId] = page;
					}
					delete promises.stories[storyId];
					return commentsPage;
				})
			;
		},
		create(comment) {
			return api.gql.createStoryComment(actionService.storyCommentFields)
				.run(comment)
				.then(item => {
					storeService.storeComment(item);
					store.storyComments[comment.storyId].unshift(item.id);
				})
			;
		}
	}

}