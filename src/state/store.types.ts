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