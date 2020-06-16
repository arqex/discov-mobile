import onstate from 'onstate'

let store = onstate({
	user: {},
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