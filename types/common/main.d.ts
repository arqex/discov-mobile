

interface ActivityAlert {
	id: string,
	title: string,
	description: string,
	level: ActivityAlertLevel,
	dismissable: boolean,
	action: string
}

interface ActivityAlertsMeta {
	count: number,
	maxLevel: ActivityAlertLevel
}

interface AuthenticatedUser {
	id: string
	email: string
	account?: PeerAccount
	discoveries?: DataPage<string>
	distories?: DataPage<Distory>
	followerGroups?: DataPage<string>
	followers?: DataPage<string>
	following?: DataPage<string>
	stories?: DataPage<string>
}

interface BgLocation {
	accuracy: number,
	altitude: number,
	bearing: number,
	id?: string,
	latitude: number,
	longitude: number,
	source?: string,
	timestamp: number
}

interface BgPermission {
	isGranted: boolean,
	updatedAt: number,
	checkedAt: number,
	requestedAt: number
}

interface DataLoaderConfig<T> {
	getFromCache: (id: string) => T
	isValid?: (data?: T) => boolean
	loadData: (id: string) => Promise<T>
}

interface DataLoaderResult<T> {
	error: any
	isLoading: boolean
	data?: T
}

interface DataPage<T> {
	total: number
	hasMore: boolean
	lastItemAt?: string
	lastUpdatedAt: number
	items: T[]
}

interface Discovery {
	id: string
	storyId: string
	discovererId: string
	extra: {
		seen: boolean
	}
	createdAt: Date
}

interface DiscovStore {
	status: string
	accountActivities: { [id: string]: ActivityAlert },
	accountStatus: {
		error?: any
		loading?: boolean
	},
	comments: { [id: string]: StoryComment },
	discoveries: { [id: string]: Discovery },
	peerAccounts: { [id: string]: PeerAccount },
	peerMeta: { [id: string]: PeerMeta },
	stories: { [id: string]: Story },
	storyComments: { [id: string]: DataPage<string> }
	user?: AuthenticatedUser
}

interface Distory {
	id: string
	storyId: string
	discoveryId?: string
	lat?: number
	lng?: number
}

interface FgPermission extends BgPermission {
	canAskAgain: boolean
}

interface FollowerGroup {
	id: string
	ownerId: string
	name: string
	aggregated: any
	createdAt: number
	updatedAt: number
	members: DataPage<string>
}
interface LocationFence {
	location: BgLocation,
	distanceToDiscovery: number
}

interface StoredPermissions {
	foreground?: FgPermission,
	background?: BgPermission
}

interface PagedResult {
	items: string[]
	hasMore: boolean
	total: number
	lastUpdated: Date
}

interface PeerAccount {
	lastUpdatedAt: Date
	id: string
	displayName: string
	avatarPic?: string
	isFollower?: boolean
	isFollowing?: boolean
}

interface PeerAccount {
	id: string
	data: any
}

interface StoryContent {
	type: string
	text: string
	assets
}

interface StoryPlace {
	name: string
	type: string
	sourceId?: string
}

interface StoryAggregated {
	commentsCount?: number,
	place: StoryPlace
}

enum StoryStatus {
	draft = 'draft',
	published = 'published',
	deleted = 'deleted',
	expired = 'expired'
}

interface Story {
	id: string
	ownerId: string
	lat: number
	lng: number
	discoverDistance: number
	createdAt: string
	updatedAt: string
	expiresAt: string
	status: StoryStatus
	lastUpdatedAt: Date
	content: StoryContent
	aggregated: StoryAggregated
	sharedWIdth?: string[]
	discoveryId?: string
}

interface StoryComment {
	content: StoryContent
	storyId: string
	commenterId: string
	createdAt: string
	deleted: boolean
}