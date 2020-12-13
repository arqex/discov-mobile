import ors from '@arqex/ors';

let store = ors({
	status: 'INIT',
	user: {},
	accountStatus: {},
	discoveries: {},
	stories: {},
	storyComments: {},
	comments: {},
	peerAccounts: {},
	peerMeta: {},
	relationships: {},
	followerGroups: {},
	placesByLocation: {},
	addressByLocation: {},
	locationData: {}
})

export default store;