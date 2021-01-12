enum ActivityAlertLevel {
	NONE = 0,
	INFO = 3,
	WARNING = 6,
	ERROR = 10
}

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
	discoveries?: DataPage
	followers?: DataPage
	following?: DataPage
	stories?: DataPage
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

interface DataPage {
	total: number
	hasMore: boolean
	lastItemAt?: string
	lastUpdatedAt: number
	items: string[]
}

interface Discovery {
	id: string
	storyId: string
	discovererId: string
	seen: boolean
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
	stories: { [id: string]: Story },
	user?: AuthenticatedUser
}

interface Distory {
	id: string
	storyId: string
	discoveryId: string
	lat?: number
	lng?: number
}

interface FgPermission extends BgPermission {
	canAskAgain: boolean
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