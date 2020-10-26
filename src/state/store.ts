import ors from '@arqex/ors';

let store = ors({
	status: 'INIT',
	user: {},
	accountStatus: {},
	discoveries: {},
	stories: {},
	storyComments: {},
	peerAccounts: {},
	peerMeta: {},
	relationships: {},
	followerGroups: {},
	placesByLocation: {},
	addressByLocation: {},
	currentPosition: {},
	distanceFromOutOfFence: 0 // 0 means no discoveries
})

export default store;