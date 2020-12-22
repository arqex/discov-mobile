let actions, store, services;

export const storyCommentService = {
	init(ac, st, sr) {
		actions = ac;
		store = st;
		services = sr;
	},

	loadStoryComments( storyId, loadMore? ){
		actions.storyComment.loadStoryComments( storyId, loadMore );
	}
}