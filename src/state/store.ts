import ors from '@arqex/ors';
import { ActivityAlert } from '../services';

interface DataPage {
	total: number
	hasMore: boolean
	lastItemAt?: string
	lastUpdatedAt: number
	items: string[]
}

interface AuthenticatedUser {
	id: string
	email: string
	account?: PeerAccount
	discoveries?: DataPage
	followers?: DataPage
	following?: DataPage
	stories?: DataPage
}
interface DiscovStore {
	status: string
	user?: AuthenticatedUser
	accountActivities: {
		[id: string]: ActivityAlert
	},
	accountStatus: {
		error?: any
		loading?: boolean
	},
	discoveries: {
		[id: string]: Discovery
	},
	stories: {
		[id: string]: Story
	},
	comments: {
		
	}
}

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
	relationships: {},
	followerGroups: {},
	placesByLocation: {},
	addressByLocation: {},
	locationData: {},
	alerts: {}
})

export default store;