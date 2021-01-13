import ors from '@arqex/ors';

let store: DiscovStore = ors({
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
	followerGroups: {},
	placesByLocation: {},
	addressByLocation: {},
	locationData: {},
	alerts: {}
})

export default store;