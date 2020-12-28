import ors from '@arqex/ors';

let store = ors({
	status: 'INIT',
	user: {},
	accountActivities: {},
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
	locationData: {},
	alerts: {}
})

export default store;