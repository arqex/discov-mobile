let actions, store;

export const storyCommentService = {
	init(ac, st) {
		actions = ac;
		store = st;
	},

	loadStoryComments( storyId, loadMore? ){
		actions.storyComment.loadStoryComments( storyId, loadMore );
	}
}