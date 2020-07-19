import onstate from 'onstate'

let store = onstate({
	status: 'INIT',
	user: {},
	accountStatus: {},
	discoveries: {},
	stories: {},
	peerAccounts: {},
	peerMeta: {},
	relationships: {},
	followerGroups: {},
	placesByLocation: {},
	addressByLocation: {},
	currentPosition: {}
})

export default store;